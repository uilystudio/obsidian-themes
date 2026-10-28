-- Lua: local, functions, tables, booleans
local Theme = { name = "Obsidian", enabled = true }
local function describe(theme)
  return string.format("%s: %s", theme.name, tostring(theme.enabled))
end
print(describe(Theme))
