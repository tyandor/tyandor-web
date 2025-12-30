Help me refine these instructions, which will be used to prompt an AI code assistant, to build a technology radar: 

Please build a technology radar application using Next.js and PostgresQL, to be hosted on Red Hat Openshift managed platform plus, that meets these feature requirements: 

- Main application page displays a radar view with a 4-quadrant grid and four separate rings:
  - Quadrant names: Languages/frameworks, Tools, Platforms, Techniques
  - Rings from center: Adopt, Trial, Assess, Hold
  - Build this UI with d3.js
  - Example landing page: https://www.thoughtworks.com/radar
- An api endpoint that can be called by a cron job on MP+
  - the endpoint fetches the latest n entries from an array of user defined rss feeds
  - and populates the technology radar with the new items, and marks them with a "to review" tag
- Secondary UI pages should include:
  - A page to manually add/remove/edit entries
  - A page for defining rss feed sources and number to fetch from each


