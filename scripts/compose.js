import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';

const contentTypes = ['post', 'quote', 'article', 'idea', 'project', 'tool', 'design', 'book'];

function generateFrontmatter(type, title) {
  const date = new Date().toISOString().split('T')[0];
  let frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\n`;

  switch (type) {
    case 'post':
      frontmatter += 'tags: []\ncategory: "Uncategorized"\n';
      break;
    case 'quote':
      frontmatter += 'author: ""\n';
      break;
    case 'article':
      frontmatter += 'author: ""\ndescription: ""\ntags: []\n';
      break;
    case 'idea':
      frontmatter += 'summary: ""\ncategory: ""\n';
      break;
    case 'project':
      frontmatter += 'description: ""\nstatus: "In Progress"\ntechnologies: []\nimage: "/placeholder.svg?height=600&width=1200"\nlink: ""\n';
      break;
    case 'tool':
      frontmatter += 'description: ""\ncategory: ""\nimage: "/placeholder.svg?height=600&width=1200"\nlink: ""\n';
      break;
    case 'design':
      frontmatter += 'description: ""\ncategory: ""\nimage: "/placeholder.svg?height=600&width=1200"\n';
      break;
    case 'book':
      frontmatter += 'author: ""\ndescription: ""\ngenre: ""\nrating: 0\nimage: "/placeholder.svg?height=600&width=1200"\n';
      break;
  }

  frontmatter += '---\n\n# ' + title + '\n\nAdd your content here.\n';
  return frontmatter;
}

async function createMdxFile(type, title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const directory = path.join(process.cwd(), '..', type + 's');
  const filePath = path.join(directory, `${slug}.mdx`);

  try {
    await fs.access(directory);
  } catch (error) {
    console.error(`Error: Directory '${type}s' does not exist.`);
    process.exit(1);
  }

  try {
    await fs.access(filePath);
    console.error(`Error: File '${slug}.mdx' already exists in the '${type}s' directory.`);
    process.exit(1);
  } catch (error) {
    // File doesn't exist, we can proceed
  }

  const content = generateFrontmatter(type, title);

  try {
    await fs.writeFile(filePath, content);
    console.log(`Successfully created ${type} file: ${filePath}`);
  } catch (error) {
    console.error('Error creating file:', error);
  }
}

async function main() {
  try {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the content type:',
        choices: contentTypes
      }
    ]);

    const { title } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: `Enter the title for the new ${type}:`,
        validate: (input) => input.trim() !== '' || 'Title cannot be empty'
      }
    ]);

    await createMdxFile(type, title);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();

// Example usage:
// node compose.js

