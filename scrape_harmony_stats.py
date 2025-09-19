# scrape_harmony_stats.py

import os
import time
import pandas as pd
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

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

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        print(f"正在访问目标网页: {TARGET_URL}")
        driver.get(TARGET_URL)

        # 等待详细数据表格（class="data-table"）加载完成
        print("等待详细数据表格加载...")
        wait = WebDriverWait(driver, 30)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table.data-table")))

        print("表格已加载，正在解析数据...")
        # 使用pandas的read_html直接从页面源码解析表格
        # read_html会返回一个包含页面上所有表格的列表
        tables = pd.read_html(driver.page_source)
        
        # 根据MHTML文件，我们需要的表格是页面上的第一个
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
    if new_df is None:
        print("未获取到新数据，不更新CSV。")
        return

    try:
        # --- 数据清洗和格式化 ---
        # 1. 重命名列名
        new_df.columns = ['Date_Raw', 'Installations', 'Daily_Increase', 'Growth_Rate']
        
        # 2. 处理日期：补全年份
        current_year = datetime.now().year
        new_df['Date'] = pd.to_datetime(f'{current_year}-' + new_df['Date_Raw'])
        new_df['Date'] = new_df['Date'].dt.strftime('%Y-%m-%d') # 格式化为 YYYY-MM-DD

        # 3. 处理装机量：将 "xx万" 转换为整数
        new_df['Installations'] = (new_df['Installations'].str.replace('万', '').astype(float) * 10000).astype(int)
        
        # 4. 只保留我们需要的核心列
        new_df = new_df[['Date', 'Installations', 'Daily_Increase', 'Growth_Rate']]
        print("新数据清洗完成，准备合并。")
        print("最新获取的数据条目数:", len(new_df))
        print(new_df.head().to_string())

        # --- 合并与去重 ---
        # 1. 如果CSV已存在，读取旧数据
        if os.path.exists(CSV_FILE):
            print(f"读取现有CSV文件: {CSV_FILE}")
            existing_df = pd.read_csv(CSV_FILE)
            # 合并新旧数据
            combined_df = pd.concat([existing_df, new_df], ignore_index=True)
            print(f"合并前总条目数 (旧+新): {len(combined_df)}")
        else:
            print("CSV文件不存在，将创建新文件。")
            combined_df = new_df

        # 2. 基于'Date'列去除重复项，保留最后出现的记录（即最新记录）
        combined_df.drop_duplicates(subset=['Date'], keep='last', inplace=True)
        
        # 3. 按日期升序排序
        combined_df.sort_values(by='Date', ascending=True, inplace=True)

        # 4. 保存回CSV文件
        combined_df.to_csv(CSV_FILE, index=False)
        print(f"CSV文件更新成功！当前总条目数: {len(combined_df)}")

    except Exception as e:
        print(f"处理数据或更新CSV时出错: {e}")

if __name__ == "__main__":
    print("开始执行爬虫任务...")
    latest_data_df = fetch_harmony_data()
    process_and_update_csv(latest_data_df)
    print("任务执行完毕。")
