import os

extensions = ['.ts', '.html', '.css']  # змінити під свої потреби
total = 0

for root, dirs, files in os.walk('./src'):
    for file in files:
        if any(file.endswith(ext) for ext in extensions):
            with open(os.path.join(root, file), 'r', errors='ignore') as f:
                total += sum(1 for _ in f)

print(f'Total lines of code: {total}')