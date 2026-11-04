const understandingData = {
    modules: [
        {
            id: "understanding-concepts",
            title: "Understanding Accuracy & Precision",
            sections: [
                {
                    title: "Accuracy Fundamentals",
                    type: "flip-cards",
                    cards: [
                        { frontTitle: "Simple Words", frontText: "Why can't we just trust a map by looking at it?", backTitle: "The Visual Illusion", backText: "Maps look polished and complete, but computer classification algorithms make mistakes, mislabeling land covers." },
                        { frontTitle: "Literature Definition", frontText: "What do authoritative geospatial guidelines say?", backTitle: "Congalton & Green Standard", backText: "Accuracy assessment is the quantitative comparison of a classified map against reference data assumed to be true." },
                        { frontTitle: "Technical Perspective", frontText: "How is it measured statistically?", backTitle: "Error Matrix & Metrics", backText: "Using omission/commission errors, overall accuracy, and Kappa coefficients to test hypotheses." }
                    ]
                },
                {
                    title: "Precision Fundamentals",
                    type: "flip-cards",
                    cards: [
                        { frontTitle: "Simple Words", frontText: "What does precision mean in mapping?", backTitle: "Consistency", backText: "Precision is how tightly clustered or repeatable measurements are, regardless of whether they hit the true target location." },
                        { frontTitle: "Literature Definition", frontText: "How is precision defined in spatial stats?", backTitle: "Variance & Repeatability", backText: "Refers to the exactness of measurement or classification clustering without systematic bias." },
                        { frontTitle: "Technical Perspective", frontText: "What is its mathematical role?", backTitle: "Variance Reduction", backText: "Minimizing random error and spatial variance across repeated trials." }
                    ]
                }
            ]
        },
        {
            id: "dartboard-game",
            title: "Dartboard Simulation",
            sections: [
                {
                    title: "Accuracy vs Precision Dartboard",
                    type: "dartboard-interactive"
                }
            ]
        },
        {
            id: "understanding-quiz",
            title: "Quiz: Accuracy & Precision",
            sections: [
                {
                    title: "Self-Assessment Quiz",
                    type: "timed-quiz",
                    questions: [
                        { q: "What is the primary role of reference data in accuracy assessment?", options: ["To train machine learning classifiers", "To act as an independent benchmark to verify map accuracy", "To replace satellite imagery", "To speed up processing"], answer: 1, timer: 30, explanation: "Reference ground-truth data provides an independent benchmark to quantitatively verify map accuracy." },
                        { q: "High precision combined with low accuracy means:", options: ["Darts are close to bullseye and each other", "Darts are scattered far from bullseye", "Darts are tightly clustered together away from the bullseye", "Random error is high"], answer: 2, timer: 30, explanation: "High precision means tight clustering; low accuracy means it is far from the true bullseye." }
                    ]
                }
            ]
        }
    ]
};
