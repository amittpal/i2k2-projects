// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

exports.config = {
  allScriptsTimeout: 51000,
  // specs: [],

  suites: {
    centre_meta: [
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",

      // Centre-planning
      "./src/app/modules/centre-planning/import-centres/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/import-centres/import-center/*.e2e-spec.ts",
    ],
    e2e_plan_exam: [
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",
      "./src/app/modules/main/*.e2e-spec.ts",
      // Exam-planning
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-list/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/exam/*.e2e-spec.ts",
      // Question-Requirements
      "./src/app/modules/exam-planning/question-requirements/main/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/question-requirements/question-requirements-list/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/question-requirements/question-requirements-manage/*.e2e-spec.ts",
    ],
    exam_to_plan_centre: [
      // Case 1
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",

      // Create a Exam
      "./src/app/modules/main/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-list/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/exam/*.e2e-spec.ts",

      // Create a layout
      "./src/app/modules/registration-planning/create-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/create-layout/layout-list/*.e2e-spec.ts",

      // Add data in layout
      "./src/app/modules/registration-planning/add-data-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-setup/layout-setup-page/*.e2e-spec.ts",

      // Map-Layout
      "./src/app/modules/registration-planning/layout-map/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout/*.e2e-spec.ts",

      // Centre-Mapping
      "./src/app/modules/centre-planning/centre-mapping/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/centre-mapping/centre-mapping-list/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/centre-mapping/centre-mapping-setup/map-centres/*.e2e-spec.ts",

      // Registration-Data
      "./src/app/modules/centre-planning/registrations/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/registrations/layout-list/*.e2e-spec.ts",

      // Plan-Centres
      "./src/app/modules/centre-planning/plan-centres/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-list/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/centre/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/shift/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-1/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-2/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-3/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/shift-per-shift/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/final/*.e2e-spec.ts",
    ],
    exam_to_admit_card: [
      // Case 1
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",

      // Create a Exam
      "./src/app/modules/main/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-list/*.e2e-spec.ts",
      "./src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/exam/*.e2e-spec.ts",

      // Create a layout
      "./src/app/modules/registration-planning/create-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/create-layout/layout-list/*.e2e-spec.ts",

      // Add data in layout
      "./src/app/modules/registration-planning/add-data-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-setup/layout-setup-page/*.e2e-spec.ts",

      // Map-Layout
      "./src/app/modules/registration-planning/layout-map/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout/*.e2e-spec.ts",

      // Centre-Mapping
      "./src/app/modules/centre-planning/centre-mapping/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/centre-mapping/centre-mapping-list/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/centre-mapping/centre-mapping-setup/map-centres/*.e2e-spec.ts",

      // Registration-Data
      "./src/app/modules/centre-planning/registrations/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/registrations/layout-list/*.e2e-spec.ts",

      // Plan-Centres
      "./src/app/modules/centre-planning/plan-centres/main/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-list/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/centre/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/shift/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-1/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-2/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/pref-3/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/shift-per-shift/*.e2e-spec.ts",
      "./src/app/modules/centre-planning/plan-centres/plan-centre-setup-custom-layout/final/*.e2e-spec.ts",

      //Admit Card Planning Starts Here
      //***************************** Admit card planning SET UP ******************************/
      "./src/app/modules/admit-card-planning/admit-card-setup/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/basic/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/additional/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/sms/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/email/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/qrcode/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/final/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //Admit Card Layout List Starts Here
      //***************************** Admit card layout preview ******************************/
      "./src/app/modules/admit-card-planning/admit-card-layout/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout/admit-card-layout-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout/admit-card-layout-preview/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //Admit Card Layout Mapping Starts Here
      //***************************** Admit card layout preview ******************************/
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/admit-card-layout-mapping-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/admit-card-layout-mapping/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //Admit Card Generate Module Starts Here
      //***************************** Admit card Generate Module ******************************/
      "./src/app/modules/admit-card-planning/admit-card-generate/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-generate/admit-card-generate-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-generate/admit-card-view/*.e2e-spec.ts",
      //*****************************  Ended ******************************/
    ],
    e2e_plan_registration: [
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",

      // Create a layout
      "./src/app/modules/registration-planning/create-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/create-layout/layout-list/*.e2e-spec.ts",

      // Add data in layout
      "./src/app/modules/registration-planning/add-data-layout/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/add-data-layout/layout-setup/layout-setup-page/*.e2e-spec.ts",

      // Map-Layout
      "./src/app/modules/registration-planning/layout-map/main/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout-list/*.e2e-spec.ts",
      "./src/app/modules/registration-planning/layout-map/map-layout/*.e2e-spec.ts",
    ],
    e2e_admit_card: [
      // To Start this suite we first need to fill concerned "ExamNumber" field in /e2e/src/assets/admit-card-planning/admit-card-setup.json
      // Login
      "./src/app.e2e-spec.ts",
      "./src/app/modules/login/login-prompt/*.e2e-spec.ts",
      "./src/app/modules/main/*.e2e-spec.ts",

      //***************************** Admit card planning SET UP ******************************/
      "./src/app/modules/admit-card-planning/admit-card-setup/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/basic/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/additional/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/sms/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/email/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/qrcode/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-setup/admit-card-setup/final/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //***************************** Admit Card Layout List ******************************/
      "./src/app/modules/admit-card-planning/admit-card-layout/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout/admit-card-layout-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout/admit-card-layout-preview/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //***************************** Admit Card Layout Mapping ******************************/
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/admit-card-layout-mapping-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-layout-mapping/admit-card-layout-mapping/*.e2e-spec.ts",
      //*****************************  Ended ******************************/

      //***************************** Admit card Generatation ******************************/
      "./src/app/modules/admit-card-planning/admit-card-generate/main/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-generate/admit-card-generate-list/*.e2e-spec.ts",
      "./src/app/modules/admit-card-planning/admit-card-generate/admit-card-view/*.e2e-spec.ts",
      //*****************************  Ended ******************************/
    ],
  },
  capabilities: {
    browserName: "chrome",
  },

  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 2500000,
    print: function () {},
  },
  onPrepare() {
    browser.manage().window().maximize();
    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.e2e.json"),
    });
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
};
