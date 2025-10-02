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
    处理抓取到的新数据，与现有CSV文件对齐，并按顺序追加新纪录。
    """
    if new_df is None or new_df.empty:
        print("未获取到有效的新数据，不更新CSV。")
        return

    try:
        # 1. 初始数据清洗和类型转换
        processed_df = (
            new_df.rename(columns={
                new_df.columns[0]: 'Date_Raw',
                new_df.columns[1]: 'Installations_Raw',
                new_df.columns[2]: 'Daily_Increase_Raw',
                new_df.columns[3]: 'Growth_Rate'
            })
            .assign(
                Installations=lambda df: (df['Installations_Raw'].str.replace('万', '', regex=False).astype(float) * 10000).astype(int),
                Daily_Increase=lambda df: (df['Daily_Increase_Raw'].str.replace('万', '', regex=False).astype(float) * 10000).astype(int)
            )
            # 保留原始的Growth_Rate列
            [['Installations', 'Daily_Increase', 'Growth_Rate']]
        )
        
        # 去除安装量完全重复的行，保留第一个
        processed_df.drop_duplicates(subset=['Installations'], keep='first', inplace=True)

        # 2. 读取现有CSV数据作为基准
        if os.path.exists(CSV_FILE) and os.path.getsize(CSV_FILE) > 0:
            print(f"读取现有CSV文件: {CSV_FILE}")
            existing_df = pd.read_csv(CSV_FILE)
            
            # 获取CSV中最新的日期和安装量
            last_entry = existing_df.iloc[-1]
            latest_date = pd.to_datetime(last_entry['Date'])
            latest_installations = last_entry['Installations']
            
            print(f"CSV中最新记录: Date={latest_date.strftime('%Y-%m-%d')}, Installations={latest_installations}")

            # 3. 【核心逻辑】筛选、排序并重新生成日期
            # 筛选出比CSV最新记录的安装量更大的新数据
            new_data_to_append = processed_df[processed_df['Installations'] > latest_installations].copy()
            
            if new_data_to_append.empty:
                print("没有发现新的安装量数据，CSV文件已是最新。")
                return
            
            # 按安装量升序排列，确保数据是按时间增长的
            new_data_to_append.sort_values(by='Installations', ascending=True, inplace=True)
            
            print(f"筛选出 {len(new_data_to_append)} 条新的安装量记录，将按顺序追加。")

            # 生成新的连续日期
            num_new_rows = len(new_data_to_append)
            # 从最新日期的后一天开始生成
            new_dates = pd.date_range(start=latest_date + timedelta(days=1), periods=num_new_rows)
            
            # 为新数据分配新生成的日期
            new_data_to_append['Date'] = new_dates.strftime('%Y-%m-%d')
            
            # 整理列顺序
            final_new_df = new_data_to_append[['Date', 'Installations', 'Daily_Increase', 'Growth_Rate']]

            # 4. 合并数据并保存
            combined_df = pd.concat([existing_df, final_new_df], ignore_index=True)

        else:
            # 如果CSV文件不存在或为空，则需要特殊处理首次写入
            print("CSV文件不存在或为空，将使用抓取的数据进行初始化。")
            # 按安装量排序
            processed_df.sort_values(by='Installations', ascending=True, inplace=True)
            
            # 假设第一条记录是某个已知起始日期，或者从今天倒推
            # 为简化，我们这里从一个固定日期开始，或者你可以自己定义
            start_date = datetime.now() - timedelta(days=len(processed_df))
            new_dates = pd.date_range(start=start_date, periods=len(processed_df))
            processed_df['Date'] = new_dates.strftime('%Y-%m-%d')
            
            combined_df = processed_df[['Date', 'Installations', 'Daily_Increase', 'Growth_Rate']]
            
        # 5. 保存到CSV
        combined_df.to_csv(CSV_FILE, index=False)
        print("--- 更新后的数据预览 (最后5条) ---")
        print(combined_df.tail(5).to_string())
        print("-----------------------------------")
        print(f"CSV文件更新成功！当前总条目数: {len(combined_df)}")

    except Exception as e:
        print(f"处理数据或更新CSV时出错: {e}")

if __name__ == "__main__":
    print("开始执行爬虫任务...")
    latest_data_df = fetch_harmony_data()
    process_and_update_csv(latest_data_df)
    print("任务执行完毕。")
