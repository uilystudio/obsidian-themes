use std::collections::HashMap;
/// Test Rust: type, macro, trait, enum, lifetimes, function.
#[derive(Debug, Clone)]
pub enum Status { Active, Inactive }
pub trait Named { fn name(&self) -> &str; }
pub struct User<'a> { pub name: &'a str, pub age: u32 }
impl<'a> Named for User<'a> { fn name(&self) -> &str { self.name } }
fn main() { let user = User { name: "Obsidian", age: 20 }; println!("{} {}", user.name(), user.age); }
