protocol Named { var name: String { get } }
struct Theme: Named {
    let name: String
    let enabled: Bool
    func description() -> String { "\(name): \(enabled)" }
}
let theme = Theme(name: "Obsidian", enabled: true)
print(theme.description())
