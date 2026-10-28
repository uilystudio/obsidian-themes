terraform { required_version = ">= 1.5.0" }
variable "theme" { type = string; default = "Obsidian" }
output "selected_theme" { value = var.theme }
