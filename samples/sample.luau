-- Luau / Roblox: types, functions, locals, strings, booleans.
type Theme = { name: string, enabled: boolean }
local function describe(theme: Theme): string
    return `{theme.name}: {theme.enabled}`
end
local current: Theme = { name = "Obsidian", enabled = true }
print(describe(current))
