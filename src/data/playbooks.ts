export interface PlaybookTask {
  id: string;
  label: string;
}

export interface PlaybookStep {
  id: string;
  title: string;
  guidance: string;
  tasks: PlaybookTask[];
}

export interface CareerPlaybook {
  slug: string;
  title: string;
  description: string;
  category: string;
  audience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  relatedOpportunities: import('../types').OpportunityType[];
  skills: string[];
  steps: PlaybookStep[];
  resources: { label: string; href: string }[];
}

const playbook = (
  slug: string, title: string, category: string, audience: string, duration: string,
  description: string, skills: string[], steps: [string, string, string, string][],
  resources: { label: string; href: string }[] = [],
): CareerPlaybook => ({
  slug, title, category, audience, difficulty: 'Beginner', duration, description, skills,
  relatedOpportunities: category === 'Students & Graduates'
    ? ['Internship', 'Attachment', 'Graduate Program', 'Job']
    : category === 'Technology'
      ? ['Job', 'Internship', 'Remote', 'Graduate Program']
      : category === 'Freelancing & Remote'
        ? ['Freelance', 'Remote', 'Job']
        : category === 'Applications'
          ? ['Job', 'Internship', 'Scholarship', 'Fellowship']
          : category === 'Interviews'
            ? ['Job', 'Internship', 'Graduate Program']
            : ['Job', 'Internship', 'Remote', 'Scholarship', 'Fellowship'],
  
  steps: steps.map(([titleText, guidance, taskOne, taskTwo], index) => ({
    id: `step-${index + 1}`, title: titleText, guidance,
    tasks: [
      { id: `step-${index + 1}-task-1`, label: taskOne },
      { id: `step-${index + 1}-task-2`, label: taskTwo },
    ],
  })),
  resources,
});

const cvResource = [{ label: 'CareerLaunch CV Builder', href: '/cv-builder' }];
const opportunityResource = [{ label: 'Browse opportunities', href: '/app/opportunities' }];
const learningResource = [{ label: 'Explore learning resources', href: '/learning' }];

export const CAREER_PLAYBOOKS: CareerPlaybook[] = [
  playbook('first-internship', 'Get Your First Internship', 'Students & Graduates', 'Students and recent graduates with limited work experience', '4 weeks', 'Turn coursework and small projects into evidence, find a relevant placement, and prepare a thoughtful application.', ['CV writing', 'Project evidence', 'Application planning'], [
    ['Choose a focused target', 'Pick one function and a realistic location or remote preference so your search and CV tell a coherent story.', 'Write a one-line internship goal with role, sector, and preferred location.', 'List five Kenyan or regional employers whose work genuinely interests you.'],
    ['Build evidence before experience', 'Coursework, volunteering, campus work, and personal projects can demonstrate useful skills when described with outcomes.', 'Add two projects or practical assignments with your contribution and tools.', 'Ask a lecturer, supervisor, or project partner to review one example.'],
    ['Prepare a clear application pack', 'Tailor your first page to the placement and remove unsupported claims.', 'Complete education, relevant skills, and a concise profile in your CV.', 'Prepare a short cover note that names the team and connects one project to its work.'],
    ['Apply and prepare to discuss your work', 'Track the source and date for each role; confirm current deadlines at the employer site.', 'Save suitable listings and record the application date and follow-up date.', 'Practise explaining one project, one challenge, and what you learned.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('first-job', 'Get Your First Job', 'Students & Graduates', 'Graduates and early-career job seekers', '6 weeks', 'Build a focused search routine, make your evidence easy to assess, and manage applications consistently.', ['Role targeting', 'CV tailoring', 'Interview preparation'], [
    ['Set a realistic role target', 'Use your strongest evidence to select entry-level titles, industries, and locations.', 'Choose up to three related role titles to search.', 'Write down location, work-mode, and minimum requirements you can verify.'],
    ['Make your experience legible', 'Show scale, tools, and outcomes where you can substantiate them.', 'Rewrite three CV bullets to describe action and result.', 'Add a project or volunteer example if your employment history is short.'],
    ['Build a repeatable application routine', 'A small number of well-matched applications is easier to tailor and follow up than indiscriminate volume.', 'Set two weekly search blocks and one follow-up block.', 'Track source link, requirements, documents sent, and next action.'],
    ['Prepare for selection', 'Practise concise examples that connect your work to the role requirements.', 'Draft four STAR stories using real events.', 'Review the employer’s official site and prepare two specific questions.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('graduate-programme-starter', 'Graduate Programme Starter', 'Students & Graduates', 'Final-year students and recent graduates', '5 weeks', 'Prepare for structured graduate recruitment with a clear eligibility check, evidence bank, and assessment plan.', ['Eligibility research', 'Aptitude tests', 'Interview examples'], [
    ['Check eligibility early', 'Programme requirements and graduation windows vary; rely on each employer’s current notice.', 'Record graduation year, degree, grade, and work-authorisation criteria.', 'Save the official programme page and deadline.'],
    ['Build a graduate evidence bank', 'Graduate schemes assess learning agility, teamwork, ownership, and reasoning through examples.', 'Write six short examples from study, leadership, work, or volunteering.', 'Map each example to a competency without overstating your role.'],
    ['Practise likely assessments', 'Use timed practice to find gaps; do not confuse practice scores with employer thresholds.', 'Schedule two timed numerical or verbal practice sessions.', 'Review mistakes and note the method that would have improved each answer.'],
    ['Submit carefully and prepare', 'Keep a copy of each response and test submission details before the deadline.', 'Tailor your CV and motivation statement to the programme.', 'Practise a concise answer to “Why this programme?” using evidence.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('professional-cv', 'Build Your First Professional CV', 'Career Foundations', 'Students, graduates, and career changers', '1 week', 'Create a truthful, readable CV that makes relevant evidence easy to find.', ['CV writing', 'Evidence selection', 'ATS readability'], [
    ['Gather accurate source material', 'Start with dates, qualifications, tools, responsibilities, and outcomes you can stand behind.', 'Collect education, work, volunteering, project, and certification details.', 'Confirm dates and names before formatting.'],
    ['Choose relevant evidence', 'A CV is a selection of proof for a target role, not a full biography.', 'Choose a target role and note its recurring requirements.', 'Select the strongest examples that demonstrate those requirements.'],
    ['Write concise bullets', 'Use action, context, and result; quantify only where records support it.', 'Rewrite experience bullets with clear verbs and specific scope.', 'Remove generic claims that lack an example.'],
    ['Review and tailor', 'Check readability on a phone and keep formatting predictable for application systems.', 'Proofread contact details, links, dates, and spelling.', 'Save a master CV and one tailored copy for a real vacancy.'],
  ], cvResource),
  playbook('build-portfolio', 'Build Your Portfolio', 'Career Foundations', 'Early-career professionals, students, and freelancers', '3 weeks', 'Present a small set of clear case studies that show what you contributed and how you think.', ['Case studies', 'Project storytelling', 'Professional presentation'], [
    ['Choose the right work', 'Three well-explained examples usually communicate more than a gallery of unfinished work.', 'Select two or three projects relevant to your target role.', 'Confirm you have permission to share each project and its materials.'],
    ['Explain your contribution', 'Make your individual role clear, especially in group or client work.', 'Write the problem, your role, constraints, and decisions for each project.', 'Add outcomes or lessons only where you can support them.'],
    ['Show the process', 'Use screenshots, diagrams, code, or a concise written walkthrough to make work verifiable.', 'Prepare one clean visual or link per case study.', 'Remove confidential client or employer information.'],
    ['Publish and review', 'A portfolio should be easy to navigate and have working contact links.', 'Publish selected projects through the CareerLaunch portfolio builder.', 'Ask one peer to test the portfolio on mobile and check every link.'],
  ], [{ label: 'Portfolio Builder', href: '/portfolio-builder' }]),
  playbook('strong-linkedin-profile', 'Build a Strong LinkedIn Profile', 'Career Foundations', 'Students, graduates, and professionals', '1 week', 'Make your profile clear to people searching for your skills, work, and career direction.', ['Professional writing', 'Networking', 'Profile positioning'], [
    ['Clarify your headline', 'State your current focus and strongest relevant skills without claiming a title you do not hold.', 'Draft a headline with target function, domain, and one or two skills.', 'Compare it with three real roles you would consider.'],
    ['Write an evidence-led About section', 'Use a short opening, practical strengths, evidence, and the kind of opportunity you seek.', 'Draft an About section using only verifiable experience.', 'Add one project or portfolio link that supports your direction.'],
    ['Complete the profile basics', 'Accurate dates and a clear photo help people understand who you are; avoid embellished credentials.', 'Check education, experience, skills, and contact details.', 'Request recommendations only from people who know your work.'],
    ['Build relevant connections', 'A specific, respectful note makes outreach more useful than mass connection requests.', 'Identify five alumni or practitioners in your target field.', 'Send one personalized question or request for a brief informational conversation.'],
  ]),
  playbook('software-developer', 'Become a Software Developer', 'Technology', 'Learners and career changers starting software development', '12 weeks', 'Build programming fundamentals, ship useful projects, and prepare for junior or internship opportunities.', ['Programming', 'Git', 'Web development'], [
    ['Choose a first stack', 'Start with one path and learn fundamentals before adding frameworks.', 'Choose a web, mobile, or backend learning path based on your target roles.', 'Set up Git and publish a small first exercise.'],
    ['Practise fundamentals daily', 'Solve practical problems involving data, control flow, testing, and debugging.', 'Complete three small exercises and explain the approach.', 'Keep a notes file of bugs and how you fixed them.'],
    ['Build projects with a user in mind', 'A useful project demonstrates decisions, reliability, and communication—not only copied tutorials.', 'Build one small tool for a real campus, community, or business need.', 'Write setup instructions, tests where suitable, and a project README.'],
    ['Prepare for entry-level roles', 'Compare your project evidence against current role requirements and fill the largest gaps first.', 'Review five local or remote junior listings for recurring skills.', 'Practise explaining architecture, trade-offs, and one debugging story.'],
  ], [...learningResource, ...opportunityResource]),
  playbook('data-analyst', 'Become a Data Analyst', 'Technology', 'Students and career changers interested in data work', '10 weeks', 'Learn to turn a question and a dataset into a checked, understandable recommendation.', ['Spreadsheets', 'SQL', 'Data storytelling'], [
    ['Learn data fundamentals', 'Understand types, missing values, joins, and the difference between description and causation.', 'Practise cleaning a small public dataset in a spreadsheet.', 'Document assumptions and missing data before drawing conclusions.'],
    ['Build query fluency', 'SQL helps you retrieve and combine data reproducibly.', 'Practise SELECT, filtering, aggregation, and joins on sample data.', 'Write a query that answers one clear business question.'],
    ['Create a compact analysis', 'A strong case study connects question, method, check, and implication.', 'Choose a public or permissioned dataset relevant to a local issue.', 'Check calculations and build one chart that supports the finding.'],
    ['Present the result', 'Explain limitations as clearly as the result itself.', 'Write a one-page summary for a non-technical reader.', 'Publish a sanitized notebook or dashboard with a reproducible method.'],
  ], [...learningResource, ...opportunityResource]),
  playbook('cloud-computing-career', 'Start a Cloud Computing Career', 'Technology', 'IT students and infrastructure professionals', '10 weeks', 'Build cloud fundamentals and deploy a small, documented project before pursuing certificates.', ['Networking', 'Linux', 'Cloud fundamentals'], [
    ['Build core foundations', 'Networking, Linux, identity, and basic scripting apply across cloud providers.', 'Practise command-line navigation and basic shell tasks.', 'Draw how DNS, HTTP, compute, storage, and identity fit together.'],
    ['Pick a provider and learn by doing', 'Use a free tier carefully and set alerts to avoid unexpected charges.', 'Complete one provider fundamentals path.', 'Set budget alerts before creating paid resources.'],
    ['Deploy a small service', 'A simple service with logs and access controls gives you a concrete learning artifact.', 'Deploy a static site or small API using a documented method.', 'Record security choices, architecture, and cleanup steps.'],
    ['Show evidence to employers', 'Describe what you built and the trade-offs, not just the badge.', 'Create a short architecture diagram and project write-up.', 'Compare entry-level cloud support roles and identify one skill gap.'],
  ], [...learningResource, ...opportunityResource]),
  playbook('ai-ml-career', 'Start an AI/ML Career', 'Technology', 'Learners with interest in data, software, and machine learning', '12 weeks', 'Pair practical Python and statistics with careful evaluation and honest communication of model limits.', ['Python', 'Statistics', 'Model evaluation'], [
    ['Strengthen prerequisites', 'Programming and statistics make model behavior easier to reason about.', 'Practise Python data handling and basic probability.', 'Explain train/test separation and why leakage matters.'],
    ['Build a baseline first', 'A simple baseline tells you whether added model complexity helps.', 'Choose a public dataset with clear usage terms.', 'Create a baseline and define a metric before tuning.'],
    ['Evaluate responsibly', 'Check errors across relevant groups and describe limits in the intended context.', 'Inspect false positives, false negatives, and data gaps.', 'Write a short limitations and intended-use section.'],
    ['Publish a reproducible project', 'Reproducibility and clear explanations matter as much as a high score.', 'Document environment, data source, and training steps.', 'Review AI/ML role requirements and identify a realistic next skill.'],
  ], [...learningResource, ...opportunityResource]),
  playbook('cybersecurity-career', 'Start a Cybersecurity Career', 'Technology', 'IT learners and professionals entering security', '10 weeks', 'Learn defensive fundamentals in authorized environments and communicate findings responsibly.', ['Networking', 'Security fundamentals', 'Incident reporting'], [
    ['Learn the foundations', 'Understand networks, operating systems, access control, and common threat concepts.', 'Review basic networking and Linux command-line concepts.', 'Create a glossary from reputable learning material.'],
    ['Practise in authorized labs', 'Only test systems you own or have explicit permission to assess.', 'Complete beginner defensive labs in a legal training environment.', 'Record the method, evidence, and remediation for each exercise.'],
    ['Build a defensive artifact', 'Log review, hardening, or incident analysis can demonstrate careful thinking.', 'Create a simple log-analysis or hardening checklist project.', 'Remove credentials and sensitive information from any published examples.'],
    ['Prepare for junior roles', 'Support, SOC, and IT roles can be practical starting points depending on local requirements.', 'Compare five current entry-level listings for repeated requirements.', 'Prepare a concise incident report from a lab exercise.'],
  ], [...learningResource, ...opportunityResource]),
  playbook('start-freelancing', 'Start Freelancing', 'Freelancing & Remote', 'Independent professionals testing freelance work', '4 weeks', 'Define a narrow service, a clear scope, and a reliable way to deliver and get paid.', ['Service design', 'Client communication', 'Scope management'], [
    ['Choose a specific service', 'A focused offer is easier for clients to understand and for you to deliver consistently.', 'Name one service, client type, and problem you can solve.', 'List the tools, time, and evidence required to deliver it.'],
    ['Prepare proof and terms', 'A sample, clear scope, milestones, and revision limits reduce misunderstandings.', 'Create one relevant sample using your own or permissioned material.', 'Draft a simple scope with deliverables, timing, and payment milestones.'],
    ['Find appropriate channels', 'Use trusted referrals and platforms whose terms you understand.', 'Identify three legitimate channels serving your niche and region.', 'Check platform fees, payment options, and dispute rules before joining.'],
    ['Deliver and learn', 'Professional updates and documented handoff build trust and repeat work.', 'Create a client intake checklist and weekly update template.', 'After a project, request feedback and record what to improve.'],
  ]),
  playbook('first-freelance-client', 'Get Your First Freelance Client', 'Freelancing & Remote', 'New freelancers with a service they can deliver', '3 weeks', 'Find a first client through a relevant offer and useful conversation rather than spam.', ['Prospecting', 'Discovery calls', 'Proposal writing'], [
    ['Define a small paid outcome', 'A bounded first project is easier to price and deliver than a broad promise.', 'Write one sentence describing the client problem and deliverable.', 'Estimate effort and identify what is outside scope.'],
    ['Find people who may need it', 'Prioritize warm professional networks and relevant businesses; respect platform rules.', 'List ten organizations or contacts with a plausible need.', 'Choose five for thoughtful, personalized outreach.'],
    ['Ask before pitching', 'A short discovery conversation reveals constraints and whether your service fits.', 'Prepare three questions about goals, audience, and timing.', 'Send a concise introduction that references a specific, accurate observation.'],
    ['Propose a clear next step', 'A practical proposal states deliverable, assumptions, timeline, and payment arrangement.', 'Draft a one-page proposal for a real potential need.', 'Confirm agreement in writing before starting work.'],
  ]),
  playbook('start-remote-work', 'Start Remote Work', 'Freelancing & Remote', 'Professionals seeking remote roles or contracts', '5 weeks', 'Prepare for remote work by demonstrating communication, self-management, and dependable delivery.', ['Written communication', 'Time management', 'Remote collaboration'], [
    ['Target legitimate remote roles', 'Remote listings can be global, regional, or restricted by country and work authorization.', 'Note eligible countries, time zones, and contract type for each listing.', 'Verify the employer and original application page.'],
    ['Show remote-ready evidence', 'Clear documentation and completed work are stronger than generic claims of independence.', 'Describe a project delivered with asynchronous communication.', 'Share a short written update or documentation sample.'],
    ['Set up reliable collaboration', 'Know your connection, backup, time-zone availability, and secure working habits.', 'Prepare a realistic work schedule across the target time zones.', 'Review device security and backup access for your essential work.'],
    ['Apply with specific examples', 'Connect each claim to a moment where you communicated and delivered without close supervision.', 'Tailor your CV to the responsibilities and eligibility rules.', 'Practise explaining how you handle blockers and handoffs.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('remote-ready-profile', 'Build a Remote-Ready Profile', 'Freelancing & Remote', 'Job seekers and freelancers pursuing remote work', '2 weeks', 'Make location eligibility, communication habits, and work evidence clear to remote teams.', ['Portfolio writing', 'Async communication', 'Cross-border awareness'], [
    ['Clarify where you can work', 'State your location and confirm work authorization, time-zone overlap, and payroll eligibility for each employer.', 'Update your location and availability accurately.', 'Create a checklist for country eligibility and contract type.'],
    ['Present remote collaboration evidence', 'Show documentation, handoffs, and outcomes from actual work or study.', 'Add one example of clear written collaboration.', 'Publish a sanitized project brief or portfolio case study.'],
    ['Make your online presence consistent', 'CV, portfolio, and profile should use consistent dates, titles, and contact details.', 'Check each profile link and remove outdated claims.', 'Prepare a short intro describing your focus and preferred work arrangement.'],
    ['Apply and communicate clearly', 'Remote interviews often assess how you explain decisions and work across time zones.', 'Tailor one application and state eligibility without ambiguity.', 'Practise a concise async status update with blockers and next steps.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('master-job-applications', 'Master Job Applications', 'Applications', 'Job seekers applying to entry-level and experienced roles', '4 weeks', 'Use a quality-first workflow to evaluate listings, tailor evidence, and follow up respectfully.', ['Vacancy analysis', 'Tailoring', 'Application tracking'], [
    ['Verify the opportunity', 'Check the employer domain, source, eligibility, application URL, and deadline before sharing personal information.', 'Open the original employer or source listing.', 'Record any missing or conflicting details for follow-up.'],
    ['Map requirements to evidence', 'Prioritize essential requirements and identify truthful examples for each.', 'Create a two-column requirement/evidence table.', 'Mark any genuine gaps so you can decide whether to apply.'],
    ['Tailor the application', 'Edit relevant sections while keeping every statement accurate and consistent.', 'Adjust your CV summary and strongest bullets for one vacancy.', 'Write a specific cover note only when requested or useful.'],
    ['Track and review', 'Record dates, source links, status, and next action to avoid missed follow-ups.', 'Log the application in the CareerLaunch tracker.', 'Review results after several applications and adjust one part of the process.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('internship-applications', 'Internship Applications', 'Applications', 'Students seeking internships or attachments', '3 weeks', 'Find placements that fit your learning goals and show how your studies translate into practical contribution.', ['Eligibility checks', 'CV tailoring', 'Professional outreach'], [
    ['Check academic fit', 'Some placements require a specific course, year, school letter, or attachment period.', 'Confirm placement dates and school requirements.', 'Ask your department how an internship or attachment is formally approved.'],
    ['Show transferable evidence', 'Relevant class projects, clubs, and volunteering can show initiative and learning.', 'Select two examples and describe your personal contribution.', 'Tailor your CV to the placement’s stated requirements.'],
    ['Prepare a professional approach', 'Use official channels and concise emails; never send sensitive documents to unverified contacts.', 'Draft a short application message with role, fit, and attachment availability.', 'Check the organization’s official contact details.'],
    ['Follow through', 'Keep applications and school paperwork aligned with deadlines.', 'Record submissions and expected response dates.', 'Prepare a brief project explanation for a screening call.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('scholarship-applications', 'Scholarship Applications', 'Applications', 'Students applying for education funding', '4 weeks', 'Organize eligibility, evidence, and application materials for each scholarship without last-minute surprises.', ['Eligibility research', 'Personal statements', 'Document planning'], [
    ['Verify eligibility and terms', 'Confirm institution, course, citizenship, financial, and service requirements on the funder’s official page.', 'Create an eligibility checklist from the official criteria.', 'Record funding coverage, obligations, and deadline.'],
    ['Gather supporting documents', 'Names and dates should match across transcripts, identification, references, and forms.', 'Request transcripts or letters early from the relevant office.', 'Make a document checklist and store copies securely.'],
    ['Write a specific statement', 'Connect your motivation, evidence, and future plans to the scholarship’s stated purpose.', 'Outline one real experience that shaped your study goals.', 'Ask a trusted reviewer to flag unclear claims.'],
    ['Submit and retain proof', 'Keep copies of the final form and submission confirmation.', 'Review every field and attachment against the official instructions.', 'Save confirmation and note any interview or follow-up date.'],
  ], [...opportunityResource, ...learningResource]),
  playbook('fellowship-applications', 'Fellowship Applications', 'Applications', 'Graduates and professionals seeking fellowships', '5 weeks', 'Build an evidence-based fellowship case around contribution, learning goals, and fit with the program.', ['Application strategy', 'Project framing', 'Recommendation planning'], [
    ['Understand the fellowship', 'Study its mission, cohort, eligibility, time commitment, and post-program expectations.', 'Summarize the fellowship goals in your own words.', 'Check eligibility, dates, costs, and any required commitment.'],
    ['Choose a credible contribution', 'A focused problem and a realistic plan are more persuasive than an oversized promise.', 'Describe one issue you have worked on or understand directly.', 'Outline a contribution that fits the fellowship resources and duration.'],
    ['Prepare evidence and recommenders', 'Give references enough time and context to provide specific, accurate support.', 'Select work samples or outcomes relevant to the fellowship.', 'Ask a recommender with direct knowledge and share the criteria.'],
    ['Refine the application', 'Keep the narrative consistent across CV, statements, and interview answers.', 'Draft each response against the exact prompt and word limit.', 'Have a peer review clarity, evidence, and missing information.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('first-interview', 'Prepare for Your First Interview', 'Interviews', 'Students, graduates, and first-time interviewees', '1 week', 'Prepare evidence-based answers and thoughtful questions without memorizing a script.', ['Interview research', 'Structured examples', 'Clear communication'], [
    ['Understand the role', 'Use the job description and official organization information to focus preparation.', 'Highlight five responsibilities or requirements.', 'Prepare a short explanation of why this work interests you.'],
    ['Build real examples', 'Use specific events and make your own contribution clear.', 'Draft STAR notes for teamwork, challenge, ownership, and learning.', 'Practise keeping each example concise and accurate.'],
    ['Prepare questions', 'Ask about the work, team, expectations, or next steps rather than questions answered on the first page.', 'Write three questions tied to the role.', 'Choose two based on the interview conversation.'],
    ['Plan the practical details', 'For online interviews, check audio, connection, location, and time zone in advance.', 'Confirm format, contact, time, and route or meeting link.', 'Prepare a brief closing summary and follow-up note.'],
  ], [{ label: 'Interview Arena', href: '/interview-arena' }, { label: 'CareerLaunch AI', href: '/ai-assistant' }]),
  playbook('technical-interview', 'Technical Interview Preparation', 'Interviews', 'Software, data, cloud, and technical candidates', '3 weeks', 'Practise explaining technical decisions, solving problems methodically, and validating your answer.', ['Problem solving', 'Technical communication', 'Code review'], [
    ['Identify the interview format', 'Requirements differ across coding, case study, take-home, and systems discussions.', 'Ask the recruiter what tools, topics, and format to expect.', 'Review role requirements and choose a focused practice set.'],
    ['Practise explaining as you solve', 'Clarifying assumptions and narrating trade-offs makes your reasoning visible.', 'Solve two representative problems aloud with a timer.', 'Review correctness, edge cases, and complexity after each attempt.'],
    ['Use your own projects', 'Interviewers may explore design decisions and your contribution in detail.', 'Prepare a project walkthrough with one trade-off and one limitation.', 'Review the relevant code or analysis so details are fresh.'],
    ['Close gaps deliberately', 'Prioritize recurring role requirements over collecting unrelated topics.', 'Record errors and choose the two most common gaps.', 'Complete targeted practice and explain the corrected approach.'],
  ], [{ label: 'Interview Arena', href: '/interview-arena' }, ...learningResource]),
  playbook('behavioral-interview', 'Behavioral Interview Preparation', 'Interviews', 'Candidates preparing for competency-based interviews', '1 week', 'Build concise, truthful examples for common competencies and reflect on what you learned.', ['Storytelling', 'Reflection', 'Communication'], [
    ['Map likely competencies', 'Use the vacancy language to identify teamwork, ownership, customer focus, or learning requirements.', 'Choose four competencies from the role description.', 'Find one real example for each from work, study, or community activity.'],
    ['Structure your stories', 'Set the situation briefly, clarify your task, describe actions, and explain the result.', 'Write bullet notes rather than a memorized script.', 'Make your personal contribution explicit in team examples.'],
    ['Prepare for follow-up questions', 'Interviewers may ask what you would change or how you measured success.', 'Note the evidence supporting each result.', 'Prepare one honest lesson or adjustment for each example.'],
    ['Practise with feedback', 'Clear, specific answers are stronger than polished but vague claims.', 'Record a practice answer and check its length and clarity.', 'Ask a peer to identify where they need more context.'],
  ], [{ label: 'Interview Arena', href: '/interview-arena' }]),
  playbook('launch-career-from-africa', 'Launch Your Career from Africa', 'Africa-first careers', 'African students, graduates, and professionals', '6 weeks', 'Build career evidence and a practical search strategy that accounts for local and cross-border realities.', ['Career positioning', 'Local market research', 'Professional networking'], [
    ['Choose a direction with evidence', 'Look at actual local and regional listings alongside your interests and existing strengths.', 'Review opportunities in Kenya and at least one regional market.', 'Identify recurring skills and location requirements in your target roles.'],
    ['Build proof in your context', 'Projects that solve a real local problem can make technical and non-technical skills concrete.', 'Choose a community, campus, or business problem you understand.', 'Create a small project or case study and document your decisions.'],
    ['Use networks respectfully', 'Alumni, professional associations, meetups, and community groups can provide context and referrals.', 'Identify three relevant communities or alumni networks.', 'Ask one specific question after researching the organization first.'],
    ['Apply with practical constraints in mind', 'Confirm pay, location, work authorization, data costs, time zone, and legitimacy before committing.', 'Build a checklist for each application and opportunity source.', 'Track applications and reflect on response patterns monthly.'],
  ], [...opportunityResource, ...learningResource]),
  playbook('international-remote-opportunities', 'Find International Remote Opportunities', 'Africa-first careers', 'African professionals seeking cross-border remote work', '5 weeks', 'Search internationally while checking country eligibility, payment, contracts, and time-zone expectations.', ['Remote search', 'Eligibility checks', 'Cross-border communication'], [
    ['Check geographic eligibility', 'Many “remote” roles are limited to specific countries or regions.', 'Record eligible locations and employment type for each listing.', 'Exclude listings that do not permit hiring from your location.'],
    ['Verify the employer and source', 'Never pay an application fee or share sensitive identity or banking information with an unverified contact.', 'Reach the employer page through its official domain.', 'Check role details and application URL before submitting information.'],
    ['Prepare clear evidence', 'International teams value written communication and demonstrable work.', 'Choose a portfolio example with a concise English-language walkthrough if appropriate.', 'State location, time-zone overlap, and work authorization accurately.'],
    ['Plan contract and payment questions', 'Confirm currency, fees, tax responsibilities, contract status, equipment, and payment timing before accepting.', 'Prepare questions for a recruiter about contract terms.', 'Compare expected schedule with local time and connectivity needs.'],
  ], [...cvResource, ...opportunityResource]),
  playbook('african-tech-career', 'Build a Career in African Tech', 'Africa-first careers', 'People interested in technology across African markets', '8 weeks', 'Connect a specific tech skill to regional products, infrastructure, and user needs.', ['Tech research', 'Portfolio projects', 'Community participation'], [
    ['Explore the ecosystem', 'African tech spans fintech, health, climate, logistics, commerce, public services, and infrastructure.', 'Choose one sector and read about three organizations working in it.', 'Note the users, constraints, and technical challenges they address.'],
    ['Select a practical skill path', 'Build depth in a role area before adding tools without a clear purpose.', 'Review role descriptions from Kenyan and regional tech employers.', 'Choose a focused learning plan tied to repeated requirements.'],
    ['Build a context-aware project', 'A project should respect user needs, connectivity, privacy, and local operating conditions.', 'Define one real user problem and test assumptions with a person if possible.', 'Build and document a small, accessible solution or analysis.'],
    ['Connect and apply', 'Communities and events can offer learning and context; evaluate opportunities using official sources.', 'Find a local or regional tech community or event.', 'Share your project and apply to one well-matched role or programme.'],
  ], [...learningResource, ...opportunityResource]),
];

export const getPlaybookBySlug = (slug: string) => CAREER_PLAYBOOKS.find((item) => item.slug === slug);
