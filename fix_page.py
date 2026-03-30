with open('app/seller/transactions/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = lines[:130] + ['    <div className="min-h-screen bg-gray-50">\n'] + lines[457:]

with open('app/seller/transactions/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
