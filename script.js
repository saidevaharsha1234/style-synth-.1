/* ======================================================
   STYLE SYNTH AI — PERSONAL STYLE ANALYSIS
   Additive feature; existing wardrobe engine unchanged
====================================================== */

(function initPersonalStyleAnalysis() {
    const cameraBtn = document.getElementById("styleCameraBtn");
    const uploadBtn = document.getElementById("styleUploadBtn");
    const cameraInput = document.getElementById("styleCameraInput");
    const photoInput = document.getElementById("stylePhotoInput");
    const preview = document.getElementById("styleCameraPreview");
    const analyzeBtn = document.getElementById("analyzeStyleBtn");
    const report = document.getElementById("styleReport");

    if (!cameraBtn || !uploadBtn || !cameraInput ||
        !photoInput || !preview || !analyzeBtn || !report) {
        return;
    }

    let previewURL = null;

    cameraBtn.addEventListener("click", function () {
        cameraInput.click();
    });

    uploadBtn.addEventListener("click", function () {
        photoInput.click();
    });

    function showSelectedPhoto(file) {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast("Please choose an image file.");
            return;
        }

        if (file.size > 12 * 1024 * 1024) {
            toast("Choose a photo smaller than 12 MB.");
            return;
        }

        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        previewURL = URL.createObjectURL(file);

        const image = document.createElement("img");
        image.alt = "Your selected style reference photo";
        image.src = previewURL;

        preview.replaceChildren(image);
        toast("Photo preview ready ✨");
    }

    cameraInput.addEventListener("change", function () {
        showSelectedPhoto(cameraInput.files[0]);
        cameraInput.value = "";
    });

    photoInput.addEventListener("change", function () {
        showSelectedPhoto(photoInput.files[0]);
        photoInput.value = "";
    });

    const palettes = {
        warm: [
            { name: "Cream", color: "#F5E6C8" },
            { name: "Olive", color: "#78834A" },
            { name: "Camel", color: "#C19A6B" },
            { name: "Rust", color: "#B65E3C" },
            { name: "Warm Brown", color: "#76513D" },
            { name: "Forest", color: "#315B45" }
        ],
        cool: [
            { name: "Navy", color: "#203A5D" },
            { name: "Cool Grey", color: "#A6ADB7" },
            { name: "Burgundy", color: "#702F45" },
            { name: "Blue", color: "#477DB3" },
            { name: "Lavender", color: "#C4B5E0" },
            { name: "White", color: "#FFFFFF" }
        ],
        neutral: [
            { name: "Beige", color: "#D8C3A5" },
            { name: "Navy", color: "#203A5D" },
            { name: "Sage", color: "#A4B5A0" },
            { name: "Charcoal", color: "#41464D" },
            { name: "Cream", color: "#F5EBD9" },
            { name: "Teal", color: "#397F83" }
        ],
        unknown: [
            { name: "White", color: "#FFFFFF" },
            { name: "Navy", color: "#203A5D" },
            { name: "Blue", color: "#477DB3" },
            { name: "Beige", color: "#D8C3A5" },
            { name: "Forest", color: "#315B45" },
            { name: "Charcoal", color: "#41464D" }
        ]
    };

    const haircutIdeas = {
        oval: {
            straight: "Try a textured crop, side part, or classic taper.",
            wavy: "Try a natural side sweep, textured layers, or a soft quiff.",
            curly: "Try a curly top with a taper or natural layered curls.",
            coily: "Try a shaped afro, short taper, or defined natural texture."
        },
        round: {
            straight: "Try a side part, textured top, or a little height at the front.",
            wavy: "Try a textured quiff, side sweep, or layered top.",
            curly: "Try a curly top with tapered sides or defined layers.",
            coily: "Try a shaped top with a neat taper or a short natural style."
        },
        square: {
            straight: "Try a classic side part, textured crop, or soft fringe.",
            wavy: "Try a relaxed side sweep or textured medium-length cut.",
            curly: "Try natural curls with a taper or a textured curly top.",
            coily: "Try a short shaped cut, taper, or defined natural texture."
        },
        oblong: {
            straight: "Try a side fringe, textured crop, or medium-length side part.",
            wavy: "Try a relaxed fringe, soft layers, or a natural side sweep.",
            curly: "Try layered curls or a textured style with balanced height.",
            coily: "Try a shaped natural style with balanced proportions."
        },
        heart: {
            straight: "Try a side-swept fringe, textured crop, or medium side part.",
            wavy: "Try a soft fringe, natural side sweep, or medium layers.",
            curly: "Try layered curls or a natural curly fringe.",
            coily: "Try a shaped natural style with a balanced silhouette."
        },
        unknown: {
            straight: "Explore a classic taper, textured crop, or side part.",
            wavy: "Explore a natural side sweep or textured medium-length cut.",
            curly: "Explore a curly top, layered curls, or a comfortable taper.",
            coily: "Explore a shaped natural style or a neat taper."
        }
    };

    const goalIdeas = {
        college: {
            title: "Clean College Style",
            tips: [
                "Try an Oxford shirt or a plain oversized tee with relaxed trousers.",
                "Pair navy, beige, cream, and blue for easy combinations.",
                "Choose comfortable sneakers and keep accessories simple."
            ]
        },
        casual: {
            title: "Relaxed Everyday Style",
            tips: [
                "Try relaxed jeans, plain tees, overshirts, or casual cargos.",
                "Use one standout piece and keep the other colors coordinated.",
                "Try clean sneakers, a simple watch, or a minimal bag."
            ]
        },
        formal: {
            title: "Smart & Polished Style",
            tips: [
                "Try a well-fitting shirt with tailored trousers.",
                "Combine navy, charcoal, cream, white, and brown accessories.",
                "Keep shoes clean and coordinate your belt when wearing one."
            ]
        },
        party: {
            title: "Occasion-Ready Style",
            tips: [
                "Try a textured shirt, a structured overshirt, or a monochrome outfit.",
                "Use a statement color with neutral trousers.",
                "Choose footwear and accessories that suit the event."
            ]
        },
        versatile: {
            title: "Versatile Personal Style",
            tips: [
                "Build around versatile tees, shirts, trousers, and clean footwear.",
                "Use two or three complementary colors per outfit.",
                "Choose pieces that can be mixed across casual and smart occasions."
            ]
        }
    };

    function makeSwatches(colors) {
        return colors.map(function (item) {
            return `
                <div class="style-swatch">
                    <div class="style-swatch-color"
                         style="background:${item.color}"></div>
                    <span>${item.name}</span>
                </div>
            `;
        }).join("");
    }

    function generateReport() {
        const undertone = document.getElementById("styleUndertone").value;
        const faceShape = document.getElementById("styleFaceShape").value;
        const hairType = document.getElementById("styleHairType").value;
        const fit = document.getElementById("styleFit").value;
        const goal = document.getElementById("styleGoal").value;

        const palette = palettes[undertone] || palettes.unknown;
        const haircut = (haircutIdeas[faceShape] || haircutIdeas.unknown)[hairType];
        const goalInfo = goalIdeas[goal] || goalIdeas.versatile;

        const undertoneText = {
            warm: "You selected warm undertones. Earthy shades such as olive, camel, cream, and rust are worth trying.",
            cool: "You selected cool undertones. Navy, blue, burgundy, cool grey, and lavender are worth trying.",
            neutral: "You selected neutral undertones. Experiment with both warm earth tones and cooler shades.",
            unknown: "Your undertone has not been established. Start with versatile shades and compare colors near your face in natural light."
        }[undertone];

        const fitText = {
            relaxed: "Explore relaxed shirts, oversized tees, straight-leg trousers, and comfortable layers.",
            regular: "Explore regular-fit shirts, straight-leg trousers, and balanced everyday layers.",
            tailored: "Explore structured shirts, tailored trousers, clean shoulder lines, and polished layers."
        }[fit];

        report.innerHTML = `
            <article class="style-report-card">
                <small class="eyebrow">YOUR PERSONAL STYLE REPORT</small>
                <h2>Your Style Direction</h2>
                <p>${goalInfo.title}</p>
                <div class="style-report-note">
                    <strong>Color guidance</strong>
                    <p>${undertoneText}</p>
                </div>
                <h3>Your suggested color palette</h3>
                <div class="style-palette">${makeSwatches(palette)}</div>
                <p class="style-report-note">
                    These are starting points, not definitive color-analysis
                    results. Lighting, fabric, personal taste, and context can
                    affect how colors appear.
                </p>
            </article>

            <article class="style-report-card">
                <small class="eyebrow">HAIR & GROOMING</small>
                <h2>Haircut Inspiration</h2>
                <p>${haircut}</p>
                <h3>Simple grooming routine</h3>
                <ul>
                    <li>Choose a haircut that works with your natural hair texture.</li>
                    <li>Show your barber reference photos and discuss upkeep.</li>
                    <li>Keep hair clean and use products suited to your hair type.</li>
                    <li>For facial hair, choose a comfortable, easy-to-maintain style.</li>
                </ul>
                <p class="style-report-note">
                    Face-shape suggestions are general styling ideas, not a
                    facial scan or professional assessment.
                </p>
            </article>

            <article class="style-report-card">
                <small class="eyebrow">OUTFIT & PRESENTATION</small>
                <h2>${goalInfo.title}</h2>
                <ul>
                    ${goalInfo.tips.map(function (tip) {
                        return `<li>${tip}</li>`;
                    }).join("")}
                </ul>
                <h3>Your preferred fit</h3>
                <p>${fitText}</p>
                <h3>Finishing touches</h3>
                <ul>
                    <li>Check that clothes feel comfortable when sitting and moving.</li>
                    <li>Keep shoes clean and coordinate accessories with the outfit.</li>
                    <li>Use good lighting when checking color combinations.</li>
                    <li>Choose styles that feel authentic and suit your routine.</li>
                </ul>
            </article>
        `;

        toast("Your personal style report is ready ✨");
        report.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    analyzeBtn.addEventListener("click", generateReport);
})();
