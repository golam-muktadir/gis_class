const processData = {
    modules: [
        {
            id: "accuracy-workflow",
            title: "Assessment Workflow",
            sections: [
                {
                    title: "End-to-End Validation Pipeline (Toledo, Ohio Case Study)",
                    type: "infographic",
                    steps: [
                        { step: "1. Sampling Design", desc: "Choosing between random, stratified, or systematic sample allocation for study areas in Toledo." },
                        { step: "2. Reference Data Collection", desc: "Gathering high-resolution GPS field points and aerial validation." },
                        { step: "3. Classified Map Generation", desc: "Producing supervised/unsupervised land-cover classifications from satellite data." },
                        { step: "4. Error Matrix Construction", desc: "Cross-tabulating mapped classes against ground truth reference pixels." },
                        { step: "5. Accuracy Metrics", desc: "Computing Producer's Accuracy, User's Accuracy, and Overall Accuracy." },
                        { step: "6. Kappa Coefficient", desc: "Testing statistical agreement beyond mere chance." },
                        { step: "7. Final Validation Report", desc: "Publishing confidence intervals and error summaries." }
                    ]
                }
            ]
        }
    ]
};
