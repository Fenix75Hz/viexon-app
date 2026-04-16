import re

file_path = "src/components/dashboard/reseller-dashboard.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Main Backgrounds and Radial gradients
content = content.replace('bg-[#020816]', 'bg-slate-950')
content = content.replace('<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(100,231,255,0.14),transparent_22%),radial-gradient(circle_at_88%_12%,rgba(60,130,255,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(27,54,120,0.24),transparent_38%)]" />', '')
content = content.replace('<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.16]" />', '')

# 2. Panel clean up
content = content.replace(
    'relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(7,14,28,0.95),rgba(3,9,22,0.98))] shadow-[0_26px_74px_rgba(2,8,22,0.54)]',
    'relative overflow-hidden rounded-[24px] border border-slate-800 bg-slate-900/80 shadow-sm'
)
content = content.replace('<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,231,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(44,96,255,0.12),transparent_40%)]" />', '')

# Sidebar UI
content = content.replace(
    'bg-[linear-gradient(180deg,rgba(6,13,28,0.94),rgba(3,8,20,0.98))] shadow-[0_28px_90px_rgba(2,8,22,0.56)]',
    'bg-slate-900 border-slate-800 shadow-sm'
)
content = content.replace('border-white/[0.08]', 'border-slate-800')

# 3. Inner cards
content = content.replace('border border-white/8 bg-white/[0.03]', 'border border-slate-800/60 bg-slate-800/40')
content = content.replace('border border-white/8 bg-[#041021]', 'border border-slate-800 bg-slate-900/60')
content = content.replace('border border-white/8 bg-white/[0.04]', 'border border-slate-800 bg-slate-900/50')
content = content.replace('bg-[#020916]', 'bg-[#0F172A]') # Revenue background
content = content.replace('border-cyan-400/14 bg-[linear-gradient(180deg,rgba(10,28,52,0.78),rgba(4,14,28,0.92))]', 'border-slate-800 bg-slate-900/60')
content = content.replace('border border-cyan-400/16 bg-[linear-gradient(90deg,rgba(7,26,48,0.9),rgba(8,16,36,0.7))]', 'border border-slate-800 bg-slate-800/40')

# 4. Elements styling and components
content = content.replace('border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[0.72rem] font-medium text-cyan-100', 'bg-slate-800 px-3 py-1 text-[0.75rem] font-medium text-slate-300 rounded-full')
content = content.replace('border border-cyan-400/18 bg-cyan-400/12 text-cyan-200 shadow-[0_0_36px_rgba(100,231,255,0.16)]', 'border border-slate-700 bg-slate-800 text-slate-300')
content = content.replace('border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200', 'bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-xs font-medium rounded-full')
content = content.replace('border border-white/10 bg-white/[0.05] text-white/80', 'border border-slate-800 bg-slate-800 text-slate-300')
content = content.replace('bg-cyan-400/8 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-cyan-100/82', 'bg-slate-800 px-3 py-1 text-[0.65rem] font-medium text-slate-300')

# Order Stages Colors
content = content.replace('border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-100', 'bg-slate-800 text-slate-300 px-2.5 py-1 text-xs font-medium rounded-full')

# Shadows (clean up)
content = content.replace('shadow-[0_0_50px_rgba(60,130,255,0.12)]', 'shadow-none')
content = content.replace('shadow-[0_0_22px_rgba(100,231,255,0.34)]', 'shadow-none')
content = content.replace('shadow-[0_0_22px_rgba(100,231,255,0.3)]', 'shadow-none')
content = content.replace('shadow-[0_0_18px_rgba(100,231,255,0.4)]', 'shadow-none')
content = content.replace('shadow-[0_0_28px_rgba(100,231,255,0.22)]', 'shadow-none')
content = content.replace('shadow-[0_0_38px_rgba(100,231,255,0.12)]', 'shadow-none')

# Fix remaining aggressive uppercase tracking 
content = content.replace('uppercase tracking-[0.24em]', 'uppercase tracking-wider')
content = content.replace('uppercase tracking-[0.18em]', 'uppercase tracking-wider')
content = content.replace('uppercase tracking-[0.16em]', 'uppercase tracking-wider')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard cleanup script fully executed.")
