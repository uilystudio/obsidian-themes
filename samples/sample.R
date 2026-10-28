# R: assignment, function, strings, booleans, dataframe
make_theme <- function(name, active = TRUE) {
  data.frame(name = name, active = active, stringsAsFactors = FALSE)
}
print(make_theme("Obsidian Cream"))
