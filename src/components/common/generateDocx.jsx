import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
} from "docx";

export const generateDocx = (resumeData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Full name and contact info header
          new Paragraph({
            text: `${(resumeData.contactInfo?.firstName || "")} ${(resumeData.contactInfo?.lastName || "")}`.trim(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: [
              resumeData.contactInfo?.phoneNumber ? `Phone: ${resumeData.contactInfo.phoneNumber}` : "",
              resumeData.contactInfo?.email ? `Email: ${resumeData.contactInfo.email}` : "",
              (resumeData.contactInfo?.city || resumeData.contactInfo?.state || resumeData.contactInfo?.country)
                ? `Location: ${[resumeData.contactInfo.city, resumeData.contactInfo.state, resumeData.contactInfo.country].filter(Boolean).join(", ")}`
                : "",
            ].filter(Boolean).join(" | "),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Summary
          resumeData.summary && new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          resumeData.summary && new Paragraph({
            text: resumeData.summary,
            spacing: { after: 300 },
          }),

          // Experience
          resumeData.experienceList?.length > 0 && new Paragraph({
            text: "Professional Experience",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          ...(resumeData.experienceList?.length > 0
            ? resumeData.experienceList.flatMap((exp) => {
                const startDate = exp.startDate
                  ? new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "";
                const endDate = exp.currentlyWorking
                  ? "Present"
                  : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "";
                const dateRange = [startDate, endDate].filter(Boolean).join(" - ");

                return [
                  new Paragraph({
                    text: `${exp.jobTitle} @ ${exp.companyName}`,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `${dateRange} | ${[exp.city, exp.state, exp.country].filter(Boolean).join(", ")}`,
                    italics: true,
                    spacing: { after: 100 },
                  }),
                  ...(Array.isArray(exp.description)
                    ? exp.description.map((point) =>
                        new Paragraph({
                          text: `• ${point}`,
                          indent: { left: 720 },
                          spacing: { after: 50 },
                        })
                      )
                    : exp.description
                      ? exp.description.split("\n").filter(Boolean).map((line) =>
                          new Paragraph({
                            text: `• ${line}`,
                            indent: { left: 720 },
                            spacing: { after: 50 },
                          })
                        )
                      : []),
                ];
              })
            : [new Paragraph("No experience data available.")]),

          // Education
          resumeData.educationList?.length > 0 && new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          ...(resumeData.educationList?.length > 0
            ? resumeData.educationList.map((edu) => {
                const levelLabel = {
                  TENTH: "X",
                  TWELFTH: "XII",
                  DIPLOMA: "Diploma",
                  BACHELORS: "Bachelor's",
                  MASTERS: "Master's",
                  MBA: "MBA",
                  PHD: "Ph.D.",
                  POST_DOCTORATE: "Post-Doc",
                }[edu.level?.toUpperCase()] || edu.level;

                const scoreText = edu.percentage
                  ? (parseFloat(edu.percentage) <= 10 ? `${edu.percentage} CGPA` : `${edu.percentage}%`)
                  : "";

                return new Paragraph({
                  children: [
                    new TextRun({ text: `${levelLabel || ""}`, bold: true }),
                    new TextRun({ text: ` – ${edu.degree || ""}` }),
                    new TextRun({ text: ` in ${edu.stream || ""}` }),
                    new TextRun({ text: ` | ${edu.institute || ""}` }),
                    new TextRun({ text: ` | ${edu.university || ""}` }),
                    new TextRun({ text: ` | ${edu.startYear || ""} - ${edu.currentlyStudying ? "Present" : edu.endYear || ""}` }),
                    new TextRun({ text: scoreText ? ` | ${scoreText}` : "" }),
                  ],
                  spacing: { after: 150 },
                });
              })
            : [new Paragraph("No education data available.")]),

          // Projects
          resumeData.projectList?.length > 0 && new Paragraph({
            text: "Projects",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          ...(resumeData.projectList?.length > 0
            ? resumeData.projectList.flatMap((proj) => {
                return [
                  new Paragraph({
                    text: proj.title || "",
                    heading: HeadingLevel.HEADING_3,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: proj.techStack || "",
                    italics: true,
                    spacing: { after: 50 },
                  }),
                  proj.githubLink || proj.liveLink ? new Paragraph({
                    children: [
                      proj.githubLink ? new TextRun({ text: `GitHub: ${proj.githubLink}`, style: "Hyperlink" }) : null,
                      proj.githubLink && proj.liveLink ? new TextRun({ text: " | " }) : null,
                      proj.liveLink ? new TextRun({ text: `Live: ${proj.liveLink}`, style: "Hyperlink" }) : null,
                    ].filter(Boolean),
                    spacing: { after: 100 },
                  }) : null,
                  proj.descriptionList?.length
                    ? proj.descriptionList.map((desc) => new Paragraph({
                        text: `• ${desc}`,
                        indent: { left: 720 },
                        spacing: { after: 50 },
                      }))
                    : proj.description
                      ? proj.description.split("\n").filter(Boolean).map((line) =>
                          new Paragraph({
                            text: `• ${line}`,
                            indent: { left: 720 },
                            spacing: { after: 50 },
                          })
                        )
                      : [],
                ].filter(Boolean);
              })
            : [new Paragraph("No project data available.")]),

          // Skills
          resumeData.skillList?.length > 0 && new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          resumeData.skillList?.length > 0 && new Paragraph({
            text: resumeData.skillList.map((s) => s.skillName).join(", "),
            spacing: { after: 300 },
          }),

          // Languages
          resumeData.languageList?.length > 0 && new Paragraph({
            text: "Languages",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          resumeData.languageList?.length > 0 && new Paragraph({
            text: resumeData.languageList.map((l) => l.name).filter(Boolean).join(", "),
            spacing: { after: 300 },
          }),

          // Certifications
          resumeData.certificationList?.length > 0 && new Paragraph({
            text: "Certifications",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          ...(resumeData.certificationList?.length > 0
            ? resumeData.certificationList.map((cert) => {
                const issueDate = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "";
                const expiryDate = cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "No Expiry";

                return new Paragraph({
                  children: [
                    new TextRun({ text: cert.title || "", bold: true }),
                    new TextRun({ text: cert.issuer ? ` – ${cert.issuer}` : "" }),
                    new TextRun({ text: issueDate ? ` | ${issueDate}` : "" }),
                    new TextRun({ text: ` - ${expiryDate}` }),
                    new TextRun({ text: cert.proficiencyLevel ? ` | Level: ${cert.proficiencyLevel}` : "" }),
                  ],
                  spacing: { after: 150 },
                });
              })
            : [new Paragraph("No certifications available.")]),

          // Achievements
          resumeData.achievementList?.length > 0 && new Paragraph({
            text: "Achievements",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            thematicBreak: true,
          }),
          ...(resumeData.achievementList?.length > 0
            ? resumeData.achievementList.map((a) => {
                const date = a.date ? new Date(a.date).toLocaleDateString() : "";
                return new Paragraph({
                  children: [
                    new TextRun({ text: a.title || "", bold: true }),
                    new TextRun({ text: a.description ? ` — ${a.description}` : "" }),
                    new TextRun({ text: date ? ` | ${date}` : "" }),
                  ],
                  spacing: { after: 150 },
                });
              })
            : [new Paragraph("No achievements available.")]),
        ].filter(Boolean), // remove any false/null entries
      },
    ],
  });

  return doc;
};
