data class Theme(val name: String, val isLight: Boolean = false)
interface Named { fun display(): String }
fun describe(theme: Theme): String = "${theme.name}: ${theme.isLight}"
fun main() { val theme = Theme("Obsidian"); println(describe(theme)) }
