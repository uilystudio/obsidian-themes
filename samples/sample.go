package main
import "fmt"
// Go: interface, struct, function, method, string, boolean.
type Theme struct { Name string; Enabled bool }
func (t Theme) Describe() string { return fmt.Sprintf("%s: %t", t.Name, t.Enabled) }
func main() { theme := Theme{Name: "Obsidian", Enabled: true}; fmt.Println(theme.Describe()) }
