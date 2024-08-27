import os

def get_project_root():
    current_path = os.path.abspath(__file__)
    while True:
        if os.path.exists(os.path.join(current_path, 'build.gradle')):
            return current_path
        parent_path = os.path.dirname(current_path)
        if parent_path == current_path:  # 루트 디렉토리에 도달
            raise Exception("Project root not found")
        current_path = parent_path