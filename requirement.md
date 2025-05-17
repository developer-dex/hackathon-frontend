Core Requirements
Web App
Develop a straightforward web application (no Slack, mobile, or AI integrations).
User Roles:Introduce two user roles:
Tech Lead: Can create and view kudos.
Team Member: Can only view kudos.
Kudos Entry: When a Tech Lead creates a kudos, they must specify (all mandatory):
Recipient’s Name (the individual’s name). (Text)
Team Name (the department or team). (Static dropdown of items)
Category (e.g., Teamwork, Innovation, Helping Hand) (Static dropdown of items)
Short message explaining why they deserve recognition (Text).
Kudos Wall: A main page that displays all kudos publicly. Users can filter or search kudos by recipient, team, or category
Authentication
Simple Email/Password Signup/Login:
Users can register using their company email address and password.
After logging in, they can create and view kudos.
Ensure basic security measures for password storage and user sessions.
Layered Architecture & SOPs(standard operating procedures)
Implement a layered architecture (e.g., presentation, business logic, data access).
Define and follow SOPs covering design patterns, naming conventions, file/folder organization,coding guidelines and writing tests which Cursor can follow when writing code.
Keep the code structure maintainable and easy to extend.
Analytics Dashboard
Include a basic analytics view that shows:
Top recognised individuals or teams.
Provide options to view results over specific periods (weekly, monthly, quarterly, yearly) to see who’s getting the most kudos.
Trending words or categories.
For example, if certain keywords (like “collaboration” or “customer-first”) often appear in kudos messages, or if a particular category (e.g., “Teamwork”) dominates, highlight these as trending.
This dashboard should provide useful insights into how kudos are being used.
Automated Testing
Implement automated testing to ensure the reliability and correctness of core features.
Include unit tests to verify individual functions and components.
Include integration tests to ensure different parts of the system (for ex: test APIs like in rev-proxy, top level integration tests in lancer) work smoothly together.
The tests should provide reasonable coverage of the main functionalities (e.g., kudos creation, retrieval, filtering, authentication, and analytics).
Deployment / Demo
Provide a working demo by the end of the hackathon.
A local container (Docker) or a quick cloud deployment is recommended for demonstration.
