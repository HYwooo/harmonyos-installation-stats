# scrape_harmony_stats.py

import os
import pandas as pd
from datetime import datetime
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
CSV_FILE = "harmony_install_stats.csv"

def fetch_harmony_data():
    """
    使用Selenium模拟浏览器访问网页，并抓取详细数据表。
    """
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

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
    处理抓取到的新数据，并更新到CSV文件中。
    """
    if new_df is None or new_df.empty:
        print("未获取到有效的新数据，不更新CSV。")
        return

    try:
        current_year = datetime.now().year
        
        processed_df = (
            new_df.rename(columns={
                new_df.columns[0]: 'Date_Raw',
                new_df.columns[1]: 'Installations_Raw',
                new_df.columns[2]: 'Daily_Increase',
                new_df.columns[3]: 'Growth_Rate'
            })
            .assign(
                Date=lambda df: pd.to_datetime(f'{current_year}-' + df['Date_Raw']).dt.strftime('%Y-%m-%d'),
                Installations=lambda df: (df['Installations_Raw'].str.replace('万', '', regex=False).astype(float) * 10000).astype(int)
            )
            [['Date', 'Installations', 'Daily_Increase', 'Growth_Rate']]
        )
        
        print("\n--- 本次从网页抓取并处理后的全部数据 ---")
        print(processed_df.to_string())
        print("----------------------------------------\n")

        # --- 这是关键的修改：增加文件大小检查 ---
        # 只有当CSV文件存在且内容不为空时，才读取它
        if os.path.exists(CSV_FILE) and os.path.getsize(CSV_FILE) > 0:
            print(f"读取现有CSV文件: {CSV_FILE}")
            existing_df = pd.read_csv(CSV_FILE)
            combined_df = pd.concat([existing_df, processed_df], ignore_index=True)
        else:
            if os.path.exists(CSV_FILE):
                print("CSV文件存在但为空，将直接使用新抓取的数据。")
            else:
                print("CSV文件不存在，将创建新文件。")
            combined_df = processed_df

        initial_rows = len(combined_df)
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
