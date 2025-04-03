from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Label, Input, Button, OptionList
from textual.screen import Screen
from textual.containers import Vertical, Horizontal
import os
from pathlib import Path
import json
from datetime import datetime
import subprocess

CONTENT_TYPES = ["post", "quote", "article", "idea", "project", "tool", "design", "book"]
AUTHOR_NAME = "Tyler Andor"

def generate_frontmatter(content_type: str, answers: dict) -> str:
    """Generates the frontmatter content based on the content type and answers."""
    date = datetime.now().isoformat().split("T")[0]
    frontmatter = f"""---
title: "{answers.get('title', '')}"
author: "{AUTHOR_NAME}"
date: "{date}"
categories: {json.dumps([cat.strip() for cat in answers.get('categories', '').split(',') if cat.strip()])}
tags: {json.dumps([tag.strip() for tag in answers.get('tags', '').split(',') if tag.strip()])}
"""
    match content_type:
        case "post":
            frontmatter += f"description: \"{answers.get('description', '')}\"\n"
        case "quote":
            frontmatter += f"author: \"{answers.get('author', '')}\"\n"
        case "article":
            frontmatter += f"author: \"{answers.get('author', '')}\"\ndescription: \"{answers.get('description', '')}\"\n"
        case "idea":
            frontmatter += f"summary: \"{answers.get('summary', '')}\"\n"
        case "project":
            frontmatter += f"""description: "{answers.get('description', '')}"
status: "{answers.get('status', 'In Progress')}"
technologies: {json.dumps([tech.strip() for tech in answers.get('technologies', '').split(',') if tech.strip()])}
image: "{answers.get('image', '/placeholder.svg?height=600&width=1200')}"
link: "{answers.get('link', '')}"
"""
        case "tool":
            frontmatter += f"""description: "{answers.get('description', '')}"
image: "{answers.get('image', '/placeholder.svg?height=600&width=1200')}"
link: "{answers.get('link', '')}"
"""
        case "design":
            frontmatter += f"""description: "{answers.get('description', '')}"
image: "{answers.get('image', '/placeholder.svg?height=600&width=1200')}"
"""
        case "book":
            frontmatter += f"""author: "{answers.get('author', '')}"
description: "{answers.get('description', '')}"
genre: "{answers.get('genre', '')}"
rating: {answers.get('rating', 0)}
image: "{answers.get('image', '/placeholder.svg?height=600&width=1200')}"
"""
    frontmatter += "---\n\n# " + answers.get('title', '') + "\n\nAdd your content here.\n"
    return frontmatter

def create_mdx_file(content_type: str, answers: dict) -> Path | None:
    """Creates the MDX file with the generated frontmatter and returns the file path."""
    slug = answers.get('title', '').lower().replace(r'[^a-z0-9]+', '-').replace(r'^-+|-+$', '')
    directory = Path(os.getcwd()) / ".." / (content_type + "s")
    file_path = directory / f"{slug}.mdx"

    if not directory.exists():
        print(f"Error: Directory '{content_type}s' does not exist.")
        return None

    if file_path.exists():
        print(f"Error: File '{slug}.mdx' already exists in the '{content_type}s' directory.")
        return None

    content = generate_frontmatter(content_type, answers)

    try:
        with open(file_path, "w") as f:
            f.write(content)
        print(f"Successfully created {content_type} file: {file_path}")
        return file_path
    except Exception as e:
        print(f"Error creating file: {e}")
        return None

class ContentTypeScreen(Screen):
    """Screen for selecting the content type."""

    def compose(self) -> ComposeResult:
        yield Header()
        yield Label("Select the content type:")
        options = CONTENT_TYPES  # Just use the list of strings
        yield OptionList(*options, id="content-type-list")
        yield Footer()

    def on_option_list_selected(self, event: OptionList.OptionSelected) -> None:
        """Called when an option is selected (Enter key pressed)."""
        selected_type = str(event.option)  # Extract selected type as a string
        self.app.push_screen(DetailFormScreen(content_type=selected_type))

class DetailFormScreen(Screen):
    """Screen for entering details based on the content type."""

    def __init__(self, content_type: str, **kwargs) -> None:
        super().__init__(**kwargs)
        self.content_type = content_type
        self.inputs = {}

    def compose(self) -> ComposeResult:
        yield Header()
        yield Label(f"Enter details for: {self.content_type.capitalize()}")
        with Vertical(id="detail-inputs"):
            with Horizontal():
                yield Label("Title:")
                self.inputs["title"] = Input(id="title")
                yield self.inputs["title"]
            with Horizontal():
                yield Label("Categories (comma-separated):")
                self.inputs["categories"] = Input(id="categories")
                yield self.inputs["categories"]
            with Horizontal():
                yield Label("Tags (comma-separated):")
                self.inputs["tags"] = Input(id="tags")
                yield self.inputs["tags"]

            if self.content_type in ["post", "article", "project", "tool", "design", "book"]:
                with Horizontal():
                    yield Label("Description:")
                    self.inputs["description"] = Input(id="description")
                    yield self.inputs["description"]
            elif self.content_type == "idea":
                with Horizontal():
                    yield Label("Summary:")
                    self.inputs["summary"] = Input(id="summary")
                    yield self.inputs["summary"]

            if self.content_type in ["quote", "article", "book"]:
                with Horizontal():
                    yield Label("Author:")
                    self.inputs["author"] = Input(id="author")
                    yield self.inputs["author"]

            if self.content_type == "project":
                with Horizontal():
                    yield Label("Status:")
                    self.inputs["status"] = Input(id="status", value="In Progress")
                    yield self.inputs["status"]
                with Horizontal():
                    yield Label("Technologies (comma-separated):")
                    self.inputs["technologies"] = Input(id="technologies")
                    yield self.inputs["technologies"]
                with Horizontal():
                    yield Label("Image Path:")
                    self.inputs["image"] = Input(id="image", value="/placeholder.svg?height=600&width=1200")
                    yield self.inputs["image"]
                with Horizontal():
                    yield Label("Link:")
                    self.inputs["link"] = Input(id="link")
                    yield self.inputs["link"]

            elif self.content_type == "tool":
                with Horizontal():
                    yield Label("Image Path:")
                    self.inputs["image"] = Input(id="image", value="/placeholder.svg?height=600&width=1200")
                    yield self.inputs["image"]
                with Horizontal():
                    yield Label("Link:")
                    self.inputs["link"] = Input(id="link")
                    yield self.inputs["link"]

            elif self.content_type == "design":
                with Horizontal():
                    yield Label("Image Path:")
                    self.inputs["image"] = Input(id="image", value="/placeholder.svg?height=600&width=1200")
                    yield self.inputs["image"]

            elif self.content_type == "book":
                with Horizontal():
                    yield Label("Genre:")
                    self.inputs["genre"] = Input(id="genre")
                    yield self.inputs["genre"]
                with Horizontal():
                    yield Label("Rating (0-5):")
                    self.inputs["rating"] = Input(id="rating")
                    yield self.inputs["rating"]
                with Horizontal():
                    yield Label("Image Path:")
                    self.inputs["image"] = Input(id="image", value="/placeholder.svg?height=600&width=1200")
                    yield self.inputs["image"]

        yield Button("Create File", id="create-button", variant="primary")
        yield Footer()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Event handler called when the create button is pressed."""
        if event.button.id == "create-button":
            answers = {}
            for input_id, input_widget in self.inputs.items():
                answers[input_id] = input_widget.value

            new_file_path = create_mdx_file(self.content_type, answers)
            if new_file_path:
                try:
                    subprocess.run(["nvim", str(new_file_path)])
                except FileNotFoundError:
                    print("Error: Neovim ('nvim') not found in your system's PATH.")
                except Exception as e:
                    print(f"Error opening file with Neovim: {e}")
            self.app.pop_screen()

class ContentCreatorApp(App):
    """A Textual app for creating MDX files with frontmatter."""

    SCREENS = {"content_type": ContentTypeScreen}
    BINDINGS = [
        ("q", "quit", "Quit"),
    ]

    def on_mount(self) -> None:
        self.push_screen("content_type")

if __name__ == "__main__":
    app = ContentCreatorApp()
    app.run()

