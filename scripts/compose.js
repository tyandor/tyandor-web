import fs from "fs/promises"
import path from "path"
import inquirer from "inquirer"

const contentTypes = ["post", "quote", "article", "idea", "project", "tool", "design", "book"]

function generateFrontmatter(type, answers) {
  const date = new Date().toISOString().split("T")[0]
  let frontmatter = `---
    title: "${answers.title}"
    author: "${answers.author}"
    date: "${date}"
    categories: ${JSON.stringify(answers.categories)}
    tags: ${JSON.stringify(answers.tags)}
  `

  switch (type) {
    case "post":
      frontmatter += `description: "${answers.description}"\n`
      break
    case "quote":
      frontmatter += `quote: "${answers.quote}"\n`
      break
    case "article":
      frontmatter += `description: "${answers.description}"\n`
      break
    case "idea":
      frontmatter += `summary: "${answers.summary}"\n`
      break
    case "project":
      frontmatter += `description: "${answers.description}"
        status: "${answers.status}"
        technologies: ${JSON.stringify(answers.technologies)}
        image: "${answers.image}"
        link: "${answers.link}"\n`
      break
    case "tool":
      frontmatter += `description: "${answers.description}"
      image: "${answers.image}"
      link: "${answers.link}"\n`
      break
    case "design":
      frontmatter += `description: "${answers.description}"
      image: "${answers.image}"\n`
      break
    case "book":
      frontmatter += `author: "${answers.author}"
description: "${answers.description}"
genre: "${answers.genre}"
rating: ${answers.rating}
image: "${answers.image}"\n`
      break
  }

  frontmatter += "---\n\n# " + answers.title + "\n\nAdd your content here.\n"
  return frontmatter
}

async function createMdxFile(type, answers) {
  const slug = answers.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  const directory = path.join(process.cwd(), "..", type + "s")
  const filePath = path.join(directory, `${slug}.mdx`)

  try {
    await fs.access(directory)
  } catch (error) {
    console.error(`Error: Directory '${type}s' does not exist.`)
    process.exit(1)
  }

  try {
    await fs.access(filePath)
    console.error(`Error: File '${slug}.mdx' already exists in the '${type}s' directory.`)
    process.exit(1)
  } catch (error) {
    // File doesn't exist, we can proceed
  }

  const content = generateFrontmatter(type, answers)

  try {
    await fs.writeFile(filePath, content)
    console.log(`Successfully created ${type} file: ${filePath}`)
  } catch (error) {
    console.error("Error creating file:", error)
  }
}

async function promptForDetails(type) {
  const questions = [
    {
      type: "input",
      name: "title",
      message: `Enter the title for the new ${type}:`,
      validate: (input) => input.trim() !== "" || "Title cannot be empty",
    },
    {
      type: "input",
      name: "categories",
      message: "Enter categories (comma-separated):",
      filter: (input) =>
        input
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    },
    {
      type: "input",
      name: "tags",
      message: "Enter tags (comma-separated):",
      filter: (input) =>
        input
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    },
  ]

  switch (type) {
    case "post":
    case "article":
    case "project":
    case "tool":
    case "design":
    case "book":
      questions.push({
        type: "input",
        name: "description",
        message: "Enter a brief description:",
      })
      break
    case "idea":
      questions.push({
        type: "input",
        name: "summary",
        message: "Enter a brief summary:",
      })
      break
  }

  if (["quote", "article", "book"].includes(type)) {
    questions.push({
      type: "input",
      name: "author",
      message: "Enter the author name:",
    })
  }

  if (type === "project") {
    questions.push(
      {
        type: "input",
        name: "status",
        message: "Enter the project status:",
        default: "In Progress",
      },
      {
        type: "input",
        name: "technologies",
        message: "Enter technologies used (comma-separated):",
        filter: (input) =>
          input
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      },
    )
  }

  if (["project", "tool", "design", "book"].includes(type)) {
    questions.push({
      type: "input",
      name: "image",
      message: "Enter the image path:",
      default: "/placeholder.svg?height=600&width=1200",
    })
  }

  if (["project", "tool"].includes(type)) {
    questions.push({
      type: "input",
      name: "link",
      message: "Enter the project/tool link:",
    })
  }

  if (type === "book") {
    questions.push(
      {
        type: "input",
        name: "genre",
        message: "Enter the book genre:",
      },
      {
        type: "number",
        name: "rating",
        message: "Enter the book rating (0-5):",
        validate: (input) => (input >= 0 && input <= 5) || "Rating must be between 0 and 5",
      },
    )
  }

  return inquirer.prompt(questions)
}

async function main() {
  try {
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Select the content type:",
        choices: contentTypes,
      },
    ])

    const answers = await promptForDetails(type)
    await createMdxFile(type, answers)
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main()

// Example usage:
// node compose.js

