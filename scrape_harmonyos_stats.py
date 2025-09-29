# scrape_harmony_stats.py

import os
import pandas as pd
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import io

# 目标网页URL
TARGET_URL = "https://harmony5.cn/install"
# CSV文件名
CSV_FILE = "./pages/harmonyos_installation_stats.csv"

def fetch_harmony_data():
    """
    使用Selenium模拟浏览器访问网页，并抓取详细数据表。
    """
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440x960")
    options.add_argument("--timezone=Asia/Shanghai")
    options.add_argument('user-agent=Mozilla/5.0 (Tablet; OpenHarmony 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 ArkWeb/6.0.0.47 HuaweiBrowser/5.1.8.311')

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        print(f"正在访问目标网页: {TARGET_URL}")
        driver.get(TARGET_URL)

        print("等待详细数据表格内容加载...")
        wait = WebDriverWait(driver, 30)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table.data-table tbody tr")))

        print("表格内容已加载，正在解析数据...")
        html_content = driver.page_source
        tables = pd.read_html(io.StringIO(html_content))
        
        if not tables:
            print("错误：在页面上未找到任何表格。")
            return None
            
        df = tables[0]
        print("成功将HTML表格转换为DataFrame。")
        return df

    except Exception as e:
        print(f"抓取或解析数据时发生错误: {e}")
        if driver:
            driver.save_screenshot("error_screenshot.png")
            print("已保存错误截图: error_screenshot.png")
        return None
    finally:
        if driver:
            driver.quit()

def process_and_update_csv(new_df):
    """
    处理抓取到的新数据，校正不连续的日期，并更新到CSV文件中。
    """
    if new_df is None or new_df.empty:
        print("未获取到有效的新数据，不更新CSV。")
        return

    try:
        current_year = datetime.now().year
        
        # 1. 初始数据清洗和类型转换
        processed_df = (
            new_df.rename(columns={
                new_df.columns[0]: 'Date_Raw',
                new_df.columns[1]: 'Installations_Raw',
                new_df.columns[2]: 'Daily_Increase_Raw',
                new_df.columns[3]: 'Growth_Rate'
            })
            .assign(
                # 创建一个临时的datetime对象列用于排序和比较
                Date_dt=lambda df: pd.to_datetime(f'{current_year}-' + df['Date_Raw'], errors='coerce'),
                Installations=lambda df: (df['Installations_Raw'].str.replace('万', '', regex=False).astype(float) * 10000).astype(int),
                Daily_Increase=lambda df: (df['Daily_Increase_Raw'].str.replace('万', '', regex=False).astype(float) * 10000).astype(int)
            )
            .dropna(subset=['Date_dt']) # 丢弃任何无法解析的日期行
        )

        # 2. 【核心逻辑】校正日期不连续的问题
        print("\n--- 开始执行日期校正逻辑 ---")
        # 按日期升序排序，确保按时间顺序处理
        processed_df.sort_values(by='Date_dt', ascending=True, inplace=True)
        processed_df.reset_index(drop=True, inplace=True)

        # 定义日期修正的起始点
        start_correction_date = pd.to_datetime(f'{current_year}-09-04')
        
        # 找到起始日期在DataFrame中的索引
        start_index = processed_df.index[processed_df['Date_dt'] >= start_correction_date].min()

        if pd.notna(start_index) and start_index > 0:
            # 将前一天的日期作为循环的起点
            previous_date = processed_df.loc[start_index - 1, 'Date_dt']
            
            # 从起始索引开始遍历
            for i in range(start_index, len(processed_df)):
                current_date = processed_df.loc[i, 'Date_dt']
                expected_date = previous_date + timedelta(days=1)
                
                # 如果当前日期与预期日期不符（出现跳跃）
                if current_date > expected_date:
                    print(f"检测到日期跳跃：从 {previous_date.strftime('%Y-%m-%d')} 跳到了 {current_date.strftime('%Y-%m-%d')}。")
                    print(f" -> 将当前行的日期修正为: {expected_date.strftime('%Y-%m-%d')}")
                    # 修正当前行的日期为预期的连续日期
                    processed_df.loc[i, 'Date_dt'] = expected_date
                
                # 更新"前一天"为当前行处理后的日期
                previous_date = processed_df.loc[i, 'Date_dt']
        else:
            print("未找到指定的日期校正起始点或数据不足，跳过日期校正。")
        
        print("--- 日期校正逻辑执行完毕 ---\n")

        # 3. 格式化最终的DataFrame，准备合并
        processed_df['Date'] = processed_df['Date_dt'].dt.strftime('%Y-%m-%d')
        final_new_df = processed_df[['Date', 'Installations', 'Daily_Increase', 'Growth_Rate']]

        print("\n--- 本次从网页抓取并处理后的全部数据 ---")
        print(final_new_df.to_string())
        print("----------------------------------------\n")

        # 4. 读取现有CSV，合并数据
        if os.path.exists(CSV_FILE) and os.path.getsize(CSV_FILE) > 0:
            print(f"读取现有CSV文件: {CSV_FILE}")
            existing_df = pd.read_csv(CSV_FILE)
            combined_df = pd.concat([existing_df, final_new_df], ignore_index=True)
        else:
            if os.path.exists(CSV_FILE):
                print("CSV文件存在但为空，将直接使用新抓取的数据。")
            else:
                print("CSV文件不存在，将创建新文件。")
            combined_df = final_new_df

        # 5. 去重、排序并保存
        initial_rows = len(combined_df)
        # 根据'Date'列去除重复项，并保留最后一次出现的数据（即本次抓取的新数据）
        combined_df.drop_duplicates(subset=['Date'], keep='last', inplace=True)
        rows_after_dedupe = len(combined_df)
        
        print(f"去重操作完成，移除了 {initial_rows - rows_after_dedupe} 个重复行。")
        
        combined_df.sort_values(by='Date', ascending=True, inplace=True)
        combined_df.to_csv(CSV_FILE, index=False)
        
        print(f"CSV文件更新成功！当前总条目数: {len(combined_df)}")

    except Exception as e:
        print(f"处理数据或更新CSV时出错: {e}")

if __name__ == "__main__":
    print("开始执行爬虫任务...")
    latest_data_df = fetch_harmony_data()
    process_and_update_csv(latest_data_df)
    print("任务执行完毕。")
