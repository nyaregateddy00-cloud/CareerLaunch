-- Curated active opportunities checked against official application pages on 2026-10-05.
-- Run in Supabase SQL Editor after reviewing the listings. The insert is safe to rerun:
-- an existing row with the same application URL is left unchanged.
-- Listings are external opportunities; applicants should re-check eligibility and dates.

WITH candidates (
  title, company, location, country, type, work_mode, experience_level,
  salary_range, currency, deadline, description, requirements, tags,
  application_url, source
) AS (
  VALUES
  (
    '2027 Internship Program — Session 1',
    'African Development Bank Group',
    'Abidjan, Côte d’Ivoire; African regional/country offices or remote',
    'Multiple African countries', 'Internship', NULL, 'Student/Intern',
    'Monthly stipend (amount not stated)', 'KES', DATE '2026-10-12',
    'AfDB internship session starting January 2027, lasting 3–6 months. Open to nationals of AfDB member countries who are enrolled in a Master’s programme or graduated within the previous year; applicants must be 30 or younger when the programme begins. Eligible interns receive a monthly stipend and medical cover. Work can be remote or on-site depending on the hiring unit. Check the official notice for the full field-of-study and eligibility rules.',
    ARRAY['Master’s student or recent Master’s graduate','AfDB member-country national','Age 30 or younger at programme start','English or French fluency','Application deadline: 12 October 2026'],
    ARRAY['Africa','Development','Finance','Engineering','Data','Policy','Master’s','Internship'],
    'https://www.afdb.org/en/vacancy/2027-internship-program-session-1-97099',
    'Official AfDB Careers (checked 2026-10-05)'
  ),
  (
    '2027–2028 Chevening Scholarship — Kenya',
    'Chevening / UK Foreign, Commonwealth & Development Office',
    'United Kingdom', 'United Kingdom', 'Scholarship', 'On-site', 'All Levels',
    'Scholarship award; see official terms', 'GBP', DATE '2026-10-06',
    'Applications for the 2027–2028 Chevening Scholarships in Kenya are open until 6 October 2026 at 11:00 UTC. This is a UK Government scholarship for eligible Kenyan applicants pursuing a master’s degree in the UK. The deadline is imminent; verify the time, eligibility and award terms on the official page before applying.',
    ARRAY['For eligible applicants from Kenya','Master’s study in the United Kingdom','Application deadline: 6 October 2026 at 11:00 UTC'],
    ARRAY['Scholarship','Kenya','United Kingdom','Master’s','Leadership','Public policy','Development'],
    'https://www.chevening.org/scholarship/kenya/',
    'Official Chevening (checked 2026-10-05)'
  ),
  (
    'Treasury Summer Internship 2027',
    'World Bank Group Treasury',
    'Washington, DC, United States', 'United States', 'Internship', 'On-site', 'Student/Intern',
    'USD 22.70–27.70 per hour (see official listing)', 'USD', NULL,
    'A 10-week, full-time, in-person Treasury internship scheduled for 1 June–9 August 2027. The World Bank page states applications are open and lists pay of USD 22.70–27.70 per hour. Applicants should be in the second-to-last year of a four-year degree and expect to graduate between December 2027 and September 2028; finance, economics, business and related backgrounds are encouraged. The official page does not state a closing date, so check the application portal promptly.',
    ARRAY['Second-to-last year of a four-year degree','Expected graduation between December 2027 and September 2028','Finance, economics, business or related interest','Full-time, in person in Washington, DC'],
    ARRAY['Finance','Economics','Business','United States','Treasury','Internship','Undergraduate'],
    'https://worldbankgroup.csod.com/ux/ats/careersite/6/home/requisition/38076?c=worldbankgroup',
    'Official World Bank Group Treasury (checked 2026-10-05)'
  ),
  (
    'Internship — Priority Africa and External Relations',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO internship pool supporting Priority Africa and External Relations through research, policy briefings, coordination, meetings and communications. This is an application to an intern candidate pool, not a guaranteed placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Excellent English or French','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Africa','International relations','Policy','Research','Communications','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Priority-Africa-and-External-Relations/1348535957/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Sciences Sector',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Sciences Sector internship pool covering science, water, biodiversity, climate resilience, science policy, engineering and STEM education. This is a candidate-pool application rather than a promise of placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant science, engineering, research or STEM interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Science','Engineering','Water','Climate','Biodiversity','STEM','Research','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Sciences/1348537457/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Education Sector',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Education Sector internship pool focused on education projects, policy, data analysis, research and programme delivery, with Africa and gender among the sector’s priorities. Applications join a candidate pool; placement is not guaranteed. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Interest or study in education, policy, research or programme work','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Education','Policy','Research','Data analysis','Africa','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Education-Sector/1347773857/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Digital Business Solutions',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Digital Business Solutions internship pool supporting digital strategy, ICT operations, project and knowledge systems, infrastructure and cybersecurity. This is an application to the intern pool, not a guaranteed placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant ICT, digital, project or cybersecurity interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Information technology','Digital strategy','Cybersecurity','Data','Project management','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Digital-Business-Solutions/1347770857/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Division of Financial Services',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Division of Financial Services internship pool covering financial management, policies and controls, reporting, treasury operations, accounting and financial analysis. Applications join a candidate pool and do not guarantee placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant finance, accounting, economics or analytics interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Finance','Accounting','Economics','Financial analysis','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Division-of-Financial-Services/1371236357/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Culture Sector',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Culture Sector internship pool supporting culture, creative economies, heritage and cultural policy. Applications join a candidate pool rather than a guaranteed placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant culture, heritage, arts, policy or research interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Culture','Arts','Heritage','Creative economy','Policy','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Culture-Sector/1347730257/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Communications and Public Engagement',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO communications internship pool supporting external and internal communications and public engagement across the organisation. Applications enter a candidate pool and do not guarantee placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant communications, writing, media or public-engagement interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Communications','Writing','Media','Public engagement','Marketing','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Communications-and-Public-Engagement/1347728357/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Governing Bodies Secretariat',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Governing Bodies Secretariat internship pool involving research, meeting support, reporting and briefings on UNESCO and multilateral processes. Applications join the intern pool; placement is not guaranteed. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Strong research, writing and communication skills','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['International relations','Governance','Research','Writing','Policy','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Governing-Bodies-Secretariat/1347787357/',
    'Official UNESCO Careers (checked 2026-10-05)'
  ),
  (
    'Internship — Intergovernmental Oceanographic Commission',
    'UNESCO',
    'Headquarters, field offices and institutes', 'Multiple locations', 'Internship', NULL, 'Student/Intern',
    'Unpaid', 'KES', DATE '2026-12-31',
    'UNESCO Intergovernmental Oceanographic Commission internship pool focused on ocean science, marine policy, data and international cooperation. Applications enter a candidate pool rather than a guaranteed placement. UNESCO states internships are unpaid; candidates arrange their own travel and visas. The current notice closes 31 December 2026.',
    ARRAY['Age 20 or older','Third/final-year Bachelor’s student, current postgraduate student, or degree completed within the past 12 months','Relevant ocean science, marine, environmental or policy interests','Unpaid; travel and visa costs are the candidate’s responsibility'],
    ARRAY['Ocean science','Marine','Environment','Data','Policy','Internship','Unpaid'],
    'https://careers.unesco.org/job/Multiple-INTERNSHIP-Intergovernmental-Oceanographic-Commission/1347790957/',
    'Official UNESCO Careers (checked 2026-10-05)'
  )
)
INSERT INTO public.opportunities (
  title, company, location, country, type, work_mode, experience_level,
  salary_range, currency, deadline, description, requirements, tags,
  application_url, source, status
)
SELECT
  c.title, c.company, c.location, c.country, c.type, c.work_mode,
  c.experience_level, c.salary_range, c.currency, c.deadline,
  c.description, c.requirements, c.tags, c.application_url, c.source, 'published'
FROM candidates AS c
WHERE NOT EXISTS (
  SELECT 1
  FROM public.opportunities AS existing
  WHERE existing.application_url = c.application_url
);
