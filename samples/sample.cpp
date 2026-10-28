#include <iostream>
#include <string>
#define VERSION 2
namespace obsidian {
  struct Theme { std::string name; bool active; };
  std::string describe(const Theme& theme) { return theme.name; }
}
int main() { obsidian::Theme theme{"Cream", true}; std::cout << obsidian::describe(theme) << VERSION << '\n'; }
