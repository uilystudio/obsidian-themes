class Theme {
  final String name;
  final bool enabled;
  const Theme(this.name, {this.enabled = true});
  String describe() => '$name: $enabled';
}
void main() { print(const Theme('Obsidian').describe()); }
