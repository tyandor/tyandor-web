import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const contentTypes = ['post', 'quote', 'article', 'idea', 'project'];

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

function promptForTitle(type) {
  return new Promise((resolve) => {
    rl.question(`Enter the title for the new ${type}: `, (title) => {
      resolve(title);
    });
  });
}

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node compose.js <content-type>');
    console.log('Available content types:', contentTypes.join(', '));
    process.exit(1);
  }

  const type = process.argv[2].toLowerCase();

  if (!contentTypes.includes(type)) {
    console.error(`Error: Invalid content type. Available types are: ${contentTypes.join(', ')}`);
    process.exit(1);
  }

  const title = await promptForTitle(type);
  await createMdxFile(type, title);
  rl.close();
}

main();

// Example usage:
// node compose.js post
// node compose.js quote
// node compose.js article
// node compose.js idea
// node compose.js project

