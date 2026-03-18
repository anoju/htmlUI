/**
 * CSS Specificity Calculator Logic - Comparative Version
 */

document.addEventListener('DOMContentLoaded', () => {
    const selectorInput1 = document.getElementById('selectorInput1');
    const selectorInput2 = document.getElementById('selectorInput2');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    // Result elements A
    const totalScoreA = document.getElementById('totalScoreA');
    const specSummaryA = document.getElementById('specSummaryA');
    const importantBadgeA = document.getElementById('importantBadgeA');
    const resultCardA = document.getElementById('resultCardA');

    // Result elements B
    const totalScoreB = document.getElementById('totalScoreB');
    const specSummaryB = document.getElementById('specSummaryB');
    const importantBadgeB = document.getElementById('importantBadgeB');
    const resultCardB = document.getElementById('resultCardB');

    const winnerAnnouncement = document.getElementById('winnerAnnouncement');

    /**
     * 주석 및 띄어쓰기 정규화
     */
    const cleanSelector = (selector) => {
        return selector
            .replace(/\/\*[\s\S]*?\*\//g, '') 
            .replace(/\s+/g, ' ')           
            .trim();
    };

    /**
     * 특정 선택자의 명시도 계산
     * 결과: { a, b, c, isImportant, isInline }
     */
    const calculateSpecificity = (selector) => {
        let a = 0; // ID
        let b = 0; // Class, Attribute, Pseudo-class
        let c = 0; // Element, Pseudo-element
        let isImportant = false;
        let isInline = false;

        if (!selector) return { a, b, c, isImportant, isInline };

        // 1. !important 체크
        if (selector.includes('!important')) {
            isImportant = true;
            selector = selector.replace('!important', '').trim();
        }

        // 2. 인라인 스타일 가상 체크 (사용자가 'style=' 등으로 입력했을 경우 대비)
        if (selector.startsWith('style=') || selector.startsWith('[style]')) {
            isInline = true;
            return { a: 0, b: 0, c: 0, isImportant, isInline };
        }

        // 3. ID (#id) - 100점 레이어
        const idMatches = selector.match(/#[\w-]+/g);
        if (idMatches) {
            a += idMatches.length;
            selector = selector.replace(/#[\w-]+/g, ' ');
        }

        // 4. Pseudo-elements (::after, ::before, ::first-line, ::first-letter, ::selection, ::placeholder)
        const pseudoElementsMatches = selector.match(/::[\w-]+/g);
        if (pseudoElementsMatches) {
            c += pseudoElementsMatches.length;
            selector = selector.replace(/::[\w-]+/g, ' ');
        }

        // 5. Attributes ([attr])
        const attrMatches = selector.match(/\[[^\]]+\]/g);
        if (attrMatches) {
            b += attrMatches.length;
            selector = selector.replace(/\[[^\]]+\]/g, ' ');
        }

        // 6. Classes (.class)
        const classMatches = selector.match(/\.[\w-]+/g);
        if (classMatches) {
            b += classMatches.length;
            selector = selector.replace(/\.[\w-]+/g, ' ');
        }

        // 7. Functional Pseudo-classes (:not, :is, :where, :has)
        const functionalPseudoMatches = selector.match(/:([\w-]+)\(([^)]+)\)/g);
        if (functionalPseudoMatches) {
            functionalPseudoMatches.forEach(match => {
                const inner = match.match(/\(([^)]+)\)/)[1];
                const type = match.match(/:([\w-]+)/)[1].toLowerCase();

                if (type === 'where') {
                    // contributes 0
                } else if (['is', 'not', 'has'].includes(type)) {
                    const subSelectors = inner.split(',').map(s => s.trim());
                    let maxSub = { a: 0, b: 0, c: 0 };
                    subSelectors.forEach(sub => {
                        const subSpec = calculateSpecificity(sub);
                        if (getWeightedScore(subSpec) > getWeightedScore(maxSub)) {
                            maxSub = subSpec;
                        }
                    });
                    a += maxSub.a;
                    b += maxSub.b;
                    c += maxSub.c;
                } else {
                    b += 1;
                }
            });
            selector = selector.replace(/:([\w-]+)\(([^)]+)\)/g, ' ');
        }

        // 8. Normal Pseudo-classes (:hover, :active)
        const pseudoClassMatches = selector.match(/:[\w-]+/g);
        if (pseudoClassMatches) {
            pseudoClassMatches.forEach(pc => {
                const legacyPseudoElements = [':before', ':after', ':first-line', ':first-letter'];
                if (legacyPseudoElements.includes(pc.toLowerCase())) {
                    c += 1;
                } else {
                    b += 1;
                }
            });
            selector = selector.replace(/:[\w-]+/g, ' ');
        }

        // 9. Elements & Pseudo-elements (HTML tags)
        const elementMatches = selector.match(/\b[a-zA-Z1-6-]+\b/g);
        if (elementMatches) {
            elementMatches.forEach(tag => {
                if (tag !== '*' && !['not', 'is', 'where', 'has'].includes(tag.toLowerCase())) {
                    c += 1;
                }
            });
        }

        return { a, b, c, isImportant, isInline };
    };

    /**
     * 가중 점수 계산 (사용자 요청 기준)
     * !important: Infinity
     * inline: 1000
     * ID: 100
     * Class/Pseudo/Attr: 10
     * Tag/Pseudo-el: 1
     */
    const getWeightedScore = (spec) => {
        if (spec.isImportant) return Infinity;
        let score = 0;
        if (spec.isInline) score += 1000;
        score += (spec.a * 100);
        score += (spec.b * 10);
        score += (spec.c * 1);
        return score;
    };

    const formatScore = (score) => {
        if (score === Infinity) return '∞';
        return score.toLocaleString();
    };

    const updateUICard = (card, scoreEl, summaryEl, badgeEl, spec) => {
        const score = getWeightedScore(spec);
        scoreEl.innerText = formatScore(score);
        summaryEl.innerText = `(${spec.a}, ${spec.b}, ${spec.c})`;
        
        if (spec.isImportant) {
            badgeEl.classList.remove('hidden');
        } else {
            badgeEl.classList.add('hidden');
        }
        
        card.classList.remove('result-card--winner');
        return score;
    };

    const performComparison = () => {
        const val1 = selectorInput1.value.trim();
        const val2 = selectorInput2.value.trim();

        if (!val1 && !val2) return;

        resultSection.classList.remove('hidden');

        const specA = calculateSpecificity(val1);
        const specB = calculateSpecificity(val2);

        const scoreA = updateUICard(resultCardA, totalScoreA, specSummaryA, importantBadgeA, specA);
        const scoreB = updateUICard(resultCardB, totalScoreB, specSummaryB, importantBadgeB, specB);

        // Winner 결정
        if (scoreA > scoreB) {
            resultCardA.classList.add('result-card--winner');
            winnerAnnouncement.innerText = '선택자 A가 우선순위가 더 높습니다! 🏆';
        } else if (scoreB > scoreA) {
            resultCardB.classList.add('result-card--winner');
            winnerAnnouncement.innerText = '선택자 B가 우선순위가 더 높습니다! 🏆';
        } else {
            winnerAnnouncement.innerText = '두 선택자의 우선순위가 동일합니다. 🤝';
        }
    };

    calculateBtn.addEventListener('click', performComparison);
    
    [selectorInput1, selectorInput2].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performComparison();
        });
    });
});
