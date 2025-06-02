import bcrypt from 'bcrypt';

const data = [
  [1, 1, 'Adrian', 'Vasilescu', 'Experienced corporate lawyer specializing in business contracts.', 1, '0721456789', 'adrian.vasilescu@lexpoint.ro', 'LegalEagle87!', null],
  [1, 2, 'Sebastian', 'Neagu', 'Legal expert with a strong background in property law.', 3, '0729456789', 'sebastian.neagu@juridicexperts.ro', 'CourtDefender_98!', null],
  [1, 1, 'Laura', 'Mihailescu', 'Criminal lawyer with experience in litigation and defense.', 2, '0737234567', 'laura.mihailescu@lexpoint.ro', 'LawDefender_67$', null],
  [2, 3, 'Bogdan', 'Manole', 'Financial consultant helping clients with investments and retirement planning.', 2, '0722789456', 'bogdan.manole@futurefinance.ro', 'SmartMoney42$', null],
  [2, 4, 'Daniel', 'Ionescu', 'Finance coach advising on tax strategies and savings plans.', 1, '0730567890', 'daniel.ionescu@smartinvest.ro', 'MoneyWizard42$', null],
  [2, 3, 'Diana', 'Voicu', 'Personal finance consultant specializing in budgeting and investment growth.', 3, '0738345678', 'diana.voicu@futurefinance.ro', 'SaveSmart_89!', null],
  [3, 5, 'Mihai', 'Petrescu', 'Career coach providing CV reviews and interview prep.', 3, '0723891234', 'mihai.petrescu@careerboost.ro', 'ProPathSuccess99', null],
  [3, 6, 'Sorina', 'Stanescu', 'Interview prep specialist helping professionals land their dream jobs.', 1, '0739456789', 'sorina.stanescu@careerpath.ro', 'SuccessPath_90!', null],
  [3, 5, 'Cristina', 'Radulescu', 'Career strategist focused on leadership development.', 3, '0731678901', 'cristina.radulescu@careerboost.ro', 'FutureSkills_77!', null],
  [4, 7, 'Vlad', 'Dumitru', 'Certified nutritionist focused on personalized diet plans.', 1, '0724987654', 'vlad.dumitru@vitalwellness.ro', 'HealthFocus_77!', null],
  [4, 8, 'Elena', 'Cristea', 'Certified wellness coach providing stress management strategies.', 2, '0740567890', 'elena.cristea@healthfirst.ro', 'HealthyLiving_77!', null],
  [4, 7, 'Ioana', 'Serban', 'Holistic health coach integrating fitness and mindfulness techniques.', 1, '0732789012', 'ioana.serban@vitalwellness.ro', 'WellnessWay_88!', null],
  [5, 9, 'Rares', 'Enache', 'Reliable handyman with expertise in plumbing and electrical repairs.', 2, '0725012345', 'rares.enache@fixit.ro', 'HouseFix34$', null],
  [5, 10, 'Alina', 'Popa', 'Professional handyman skilled in home renovation and furniture assembly.', 2, '0733890123', 'alina.popa@casareparatii.ro', 'FixItExpert_44$', null],
  [6, 11, 'George', 'Stan', 'IT specialist offering software development and debugging services.', 3, '0726123456', 'george.stan@codetech.ro', 'CodeMaster77!', null],
  [6, 12, 'Gabriela', 'Nistor', 'Cybersecurity analyst offering IT troubleshooting and security solutions.', 3, '0734901234', 'gabriela.nistor@softfix.ro', 'ShieldGuard_99!', null],
  [7, 13, 'Florin', 'Constantin', 'Experienced math tutor with a passion for helping students excel.', 1, '0727234567', 'florin.constantin@elitetutors.ro', 'TutorAce_56$', null],
  [7, 14, 'Monica', 'Stoica', 'Language tutor specializing in English and French lessons.', 1, '0735012345', 'monica.stoica@learnsmart.ro', 'LinguistPro_24$', null],
  [8, 15, 'Eduard', 'Munteanu', 'Photographer specializing in portrait and event photography.', 2, '0728345678', 'eduard.munteanu@creativevisions.ro', 'VisionLens24*', null],
  [8, 16, 'Beatrice', 'Tudor', 'Graphic designer focused on brand identity and digital illustrations.', 2, '0736123456', 'beatrice.tudor@designhub.ro', 'CreativeVision_58!', null]
];

const saltRounds = 10; // Higher = more secure, but slower

data.forEach(async entry => {
  const hashedPassword = await bcrypt.hash(entry[8], saltRounds);
  console.log(entry[7], " => ", hashedPassword);
});




