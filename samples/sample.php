<?php
interface Theme { public function getName(): string; }
final class Cream implements Theme {
    private string $name = 'Obsidian Cream';
    public function getName(): string { return $this->name; }
}
$theme = new Cream();
echo $theme->getName();
