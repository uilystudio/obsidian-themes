import java.util.List;
@interface Premium {}
interface Theme { String name(); }
@Premium
public class Sample implements Theme {
  private final String title = "Obsidian";
  public String name() { return title; }
  public static void main(String[] args) { System.out.println(new Sample().name()); }
}
