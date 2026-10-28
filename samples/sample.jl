struct Theme
    name::String
    enabled::Bool
end
function describe(theme::Theme)
    return "$(theme.name): $(theme.enabled)"
end
println(describe(Theme("Obsidian", true)))
