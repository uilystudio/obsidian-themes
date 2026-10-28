using System;
public interface ITheme { string Name { get; } }
[Serializable]
public sealed class Theme : ITheme {
  public string Name { get; init; } = "Obsidian";
  public bool Enabled => true;
  public override string ToString() => $"{Name}: {Enabled}";
}
