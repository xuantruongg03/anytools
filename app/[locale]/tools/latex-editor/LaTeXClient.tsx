"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./latex-styles.css";
import { toast } from "@/components/ui/Toast";

// Symbol categories
const LATEX_SYMBOLS = {
    greekLower: [
        { symbol: "α", latex: "\\alpha", name: "alpha" },
        { symbol: "β", latex: "\\beta", name: "beta" },
        { symbol: "γ", latex: "\\gamma", name: "gamma" },
        { symbol: "δ", latex: "\\delta", name: "delta" },
        { symbol: "ε", latex: "\\epsilon", name: "epsilon" },
        { symbol: "ζ", latex: "\\zeta", name: "zeta" },
        { symbol: "η", latex: "\\eta", name: "eta" },
        { symbol: "θ", latex: "\\theta", name: "theta" },
        { symbol: "ι", latex: "\\iota", name: "iota" },
        { symbol: "κ", latex: "\\kappa", name: "kappa" },
        { symbol: "λ", latex: "\\lambda", name: "lambda" },
        { symbol: "μ", latex: "\\mu", name: "mu" },
        { symbol: "ν", latex: "\\nu", name: "nu" },
        { symbol: "ξ", latex: "\\xi", name: "xi" },
        { symbol: "π", latex: "\\pi", name: "pi" },
        { symbol: "ρ", latex: "\\rho", name: "rho" },
        { symbol: "σ", latex: "\\sigma", name: "sigma" },
        { symbol: "τ", latex: "\\tau", name: "tau" },
        { symbol: "υ", latex: "\\upsilon", name: "upsilon" },
        { symbol: "φ", latex: "\\phi", name: "phi" },
        { symbol: "χ", latex: "\\chi", name: "chi" },
        { symbol: "ψ", latex: "\\psi", name: "psi" },
        { symbol: "ω", latex: "\\omega", name: "omega" },
    ],
    greekUpper: [
        { symbol: "Γ", latex: "\\Gamma", name: "Gamma" },
        { symbol: "Δ", latex: "\\Delta", name: "Delta" },
        { symbol: "Θ", latex: "\\Theta", name: "Theta" },
        { symbol: "Λ", latex: "\\Lambda", name: "Lambda" },
        { symbol: "Ξ", latex: "\\Xi", name: "Xi" },
        { symbol: "Π", latex: "\\Pi", name: "Pi" },
        { symbol: "Σ", latex: "\\Sigma", name: "Sigma" },
        { symbol: "Υ", latex: "\\Upsilon", name: "Upsilon" },
        { symbol: "Φ", latex: "\\Phi", name: "Phi" },
        { symbol: "Ψ", latex: "\\Psi", name: "Psi" },
        { symbol: "Ω", latex: "\\Omega", name: "Omega" },
    ],
    operators: [
        { symbol: "+", latex: "+", name: "plus" },
        { symbol: "−", latex: "-", name: "minus" },
        { symbol: "×", latex: "\\times", name: "times" },
        { symbol: "÷", latex: "\\div", name: "divide" },
        { symbol: "±", latex: "\\pm", name: "plus-minus" },
        { symbol: "∓", latex: "\\mp", name: "minus-plus" },
        { symbol: "·", latex: "\\cdot", name: "cdot" },
        { symbol: "∗", latex: "\\ast", name: "asterisk" },
        { symbol: "⊕", latex: "\\oplus", name: "oplus" },
        { symbol: "⊗", latex: "\\otimes", name: "otimes" },
        { symbol: "∘", latex: "\\circ", name: "circ" },
    ],
    relations: [
        { symbol: "=", latex: "=", name: "equals" },
        { symbol: "≠", latex: "\\neq", name: "not equal" },
        { symbol: "<", latex: "<", name: "less than" },
        { symbol: ">", latex: ">", name: "greater than" },
        { symbol: "≤", latex: "\\leq", name: "less or equal" },
        { symbol: "≥", latex: "\\geq", name: "greater or equal" },
        { symbol: "≪", latex: "\\ll", name: "much less" },
        { symbol: "≫", latex: "\\gg", name: "much greater" },
        { symbol: "≈", latex: "\\approx", name: "approx" },
        { symbol: "≅", latex: "\\cong", name: "congruent" },
        { symbol: "∼", latex: "\\sim", name: "similar" },
        { symbol: "≡", latex: "\\equiv", name: "equivalent" },
        { symbol: "∝", latex: "\\propto", name: "proportional" },
        { symbol: "∈", latex: "\\in", name: "element of" },
        { symbol: "∉", latex: "\\notin", name: "not element" },
        { symbol: "⊂", latex: "\\subset", name: "subset" },
        { symbol: "⊃", latex: "\\supset", name: "superset" },
        { symbol: "⊆", latex: "\\subseteq", name: "subset eq" },
        { symbol: "⊇", latex: "\\supseteq", name: "superset eq" },
    ],
    arrows: [
        { symbol: "→", latex: "\\rightarrow", name: "right arrow" },
        { symbol: "←", latex: "\\leftarrow", name: "left arrow" },
        { symbol: "↔", latex: "\\leftrightarrow", name: "left right" },
        { symbol: "⇒", latex: "\\Rightarrow", name: "implies" },
        { symbol: "⇐", latex: "\\Leftarrow", name: "implied by" },
        { symbol: "⇔", latex: "\\Leftrightarrow", name: "iff" },
        { symbol: "↑", latex: "\\uparrow", name: "up arrow" },
        { symbol: "↓", latex: "\\downarrow", name: "down arrow" },
        { symbol: "↦", latex: "\\mapsto", name: "maps to" },
    ],
    misc: [
        { symbol: "∞", latex: "\\infty", name: "infinity" },
        { symbol: "∂", latex: "\\partial", name: "partial" },
        { symbol: "∇", latex: "\\nabla", name: "nabla" },
        { symbol: "∅", latex: "\\emptyset", name: "empty set" },
        { symbol: "∀", latex: "\\forall", name: "for all" },
        { symbol: "∃", latex: "\\exists", name: "exists" },
        { symbol: "¬", latex: "\\neg", name: "not" },
        { symbol: "∧", latex: "\\land", name: "and" },
        { symbol: "∨", latex: "\\lor", name: "or" },
        { symbol: "⊥", latex: "\\perp", name: "perpendicular" },
        { symbol: "∠", latex: "\\angle", name: "angle" },
        { symbol: "°", latex: "^\\circ", name: "degree" },
        { symbol: "′", latex: "'", name: "prime" },
        { symbol: "″", latex: "''", name: "double prime" },
    ],
};

const LATEX_TEMPLATES = {
    fractions: [
        { label: "a/b", latex: "\\frac{a}{b}", preview: "\\frac{a}{b}" },
        { label: "a/b/c", latex: "\\frac{\\frac{a}{b}}{c}", preview: "\\frac{\\frac{a}{b}}{c}" },
        { label: "n!/(r!(n-r)!)", latex: "\\frac{n!}{r!(n-r)!}", preview: "\\frac{n!}{r!(n-r)!}" },
    ],
    roots: [
        { label: "√x", latex: "\\sqrt{x}", preview: "\\sqrt{x}" },
        { label: "ⁿ√x", latex: "\\sqrt[n]{x}", preview: "\\sqrt[n]{x}" },
        { label: "³√x", latex: "\\sqrt[3]{x}", preview: "\\sqrt[3]{x}" },
    ],
    powers: [
        { label: "x²", latex: "x^{2}", preview: "x^{2}" },
        { label: "xⁿ", latex: "x^{n}", preview: "x^{n}" },
        { label: "eˣ", latex: "e^{x}", preview: "e^{x}" },
        { label: "e^(iπ)", latex: "e^{i\\pi}", preview: "e^{i\\pi}" },
    ],
    subscripts: [
        { label: "x₁", latex: "x_{1}", preview: "x_{1}" },
        { label: "xₙ", latex: "x_{n}", preview: "x_{n}" },
        { label: "aᵢⱼ", latex: "a_{ij}", preview: "a_{ij}" },
    ],
    sums: [
        { label: "Σ", latex: "\\sum_{i=1}^{n}", preview: "\\sum_{i=1}^{n}" },
        { label: "Σxᵢ", latex: "\\sum_{i=1}^{n} x_i", preview: "\\sum_{i=1}^{n} x_i" },
        { label: "∏", latex: "\\prod_{i=1}^{n}", preview: "\\prod_{i=1}^{n}" },
    ],
    integrals: [
        { label: "∫", latex: "\\int", preview: "\\int" },
        { label: "∫ᵃᵇ", latex: "\\int_{a}^{b}", preview: "\\int_{a}^{b}" },
        { label: "∫f(x)dx", latex: "\\int f(x) \\, dx", preview: "\\int f(x) \\, dx" },
        { label: "∬", latex: "\\iint", preview: "\\iint" },
        { label: "∮", latex: "\\oint", preview: "\\oint" },
    ],
    limits: [
        { label: "lim", latex: "\\lim_{x \\to a}", preview: "\\lim_{x \\to a}" },
        { label: "lim→∞", latex: "\\lim_{x \\to \\infty}", preview: "\\lim_{x \\to \\infty}" },
        { label: "lim→0", latex: "\\lim_{x \\to 0}", preview: "\\lim_{x \\to 0}" },
    ],
    functions: [
        { label: "sin", latex: "\\sin", preview: "\\sin" },
        { label: "cos", latex: "\\cos", preview: "\\cos" },
        { label: "tan", latex: "\\tan", preview: "\\tan" },
        { label: "log", latex: "\\log", preview: "\\log" },
        { label: "ln", latex: "\\ln", preview: "\\ln" },
        { label: "log₁₀", latex: "\\log_{10}", preview: "\\log_{10}" },
    ],
    brackets: [
        { label: "()", latex: "\\left( \\right)", preview: "\\left( x \\right)" },
        { label: "[]", latex: "\\left[ \\right]", preview: "\\left[ x \\right]" },
        { label: "{}", latex: "\\left\\{ \\right\\}", preview: "\\left\\{ x \\right\\}" },
        { label: "||", latex: "\\left| \\right|", preview: "\\left| x \\right|" },
        { label: "⌊⌋", latex: "\\lfloor \\rfloor", preview: "\\lfloor x \\rfloor" },
        { label: "⌈⌉", latex: "\\lceil \\rceil", preview: "\\lceil x \\rceil" },
    ],
    matrices: [
        { label: "2×2", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", preview: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
        { label: "3×3", latex: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}", preview: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}" },
        { label: "det", latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}", preview: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}" },
        { label: "[2×2]", latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}", preview: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}" },
    ],
    special: [
        { label: "binom", latex: "\\binom{n}{k}", preview: "\\binom{n}{k}" },
        { label: "vec", latex: "\\vec{v}", preview: "\\vec{v}" },
        { label: "hat", latex: "\\hat{x}", preview: "\\hat{x}" },
        { label: "bar", latex: "\\bar{x}", preview: "\\bar{x}" },
        { label: "dot", latex: "\\dot{x}", preview: "\\dot{x}" },
        { label: "ddot", latex: "\\ddot{x}", preview: "\\ddot{x}" },
        { label: "tilde", latex: "\\tilde{x}", preview: "\\tilde{x}" },
    ],
};

const EXAMPLE_EQUATIONS = {
    exam: [
        { name: "Công thức nghiệm bậc 2 (Quadratic)", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", desc: "Phương trình ax² + bx + c = 0" },
        { name: "Tích phân từng phần (By Parts)", latex: "\\int u \\, dv = uv - \\int v \\, du", desc: "Tích phân nâng cao" },
        { name: "Định thức ma trận cấp 3 (3x3 Det)", latex: "\\det(A) = \\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{vmatrix}", desc: "Đại số tuyến tính" },
        { name: "Định lý Bayes (Bayes' Theorem)", latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}", desc: "Xác suất thống kê" },
        { name: "Phân phối Gauss (Normal Dist)", latex: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}", desc: "Hàm mật độ Gauss" },
        { name: "Định nghĩa đạo hàm (Derivative)", latex: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}", desc: "Giới hạn đạo hàm" },
        { name: "Hệ 3 phương trình 3 ẩn (3 Equations)", latex: "\\begin{cases} a_1 x + b_1 y + c_1 z = d_1 \\\\ a_2 x + b_2 y + c_2 z = d_2 \\\\ a_3 x + b_3 y + c_3 z = d_3 \\end{cases}", desc: "Hệ phương trình bậc nhất" },
        { name: "Tổng cấp số nhân lùi vô hạn", latex: "S = \\sum_{n=1}^{\\infty} u_1 q^{n-1} = \\frac{u_1}{1 - q} \\quad (|q| < 1)", desc: "Dãy số và giới hạn" },
    ],
    basic: [
        { name: "Phân số / Fraction", latex: "\\frac{a}{b}", desc: "\\frac{tử}{mẫu}" },
        { name: "Lũy thừa / Power", latex: "x^{2}", desc: "x^{số mũ}" },
        { name: "Chỉ số dưới / Subscript", latex: "x_{1}", desc: "x_{chỉ số}" },
        { name: "Căn bậc 2 / Square root", latex: "\\sqrt{x}", desc: "\\sqrt{biểu thức}" },
        { name: "Căn bậc n / N-th root", latex: "\\sqrt[3]{x}", desc: "\\sqrt[n]{biểu thức}" },
        { name: "Kết hợp / Combined", latex: "x_{1}^{2} + \\frac{a}{b}", desc: "Kết hợp nhiều cú pháp" },
    ],
    algebra: [
        { name: "Phương trình bậc 2", latex: "ax^2 + bx + c = 0", desc: "Quadratic equation" },
        { name: "Công thức nghiệm", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", desc: "Quadratic formula" },
        { name: "Hằng đẳng thức", latex: "(a+b)^2 = a^2 + 2ab + b^2", desc: "Square of sum" },
        { name: "Hiệu hai bình phương", latex: "a^2 - b^2 = (a-b)(a+b)", desc: "Difference of squares" },
        { name: "Lập phương của tổng", latex: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3", desc: "Cube of sum" },
        { name: "Logarit", latex: "\\log_a{b} = \\frac{\\ln b}{\\ln a}", desc: "Change of base" },
        { name: "Hệ phương trình", latex: "\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}", desc: "System of equations" },
    ],
    calculus: [
        { name: "Giới hạn / Limit", latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", desc: "Limit notation" },
        { name: "Đạo hàm / Derivative", latex: "f'(x) = \\frac{df}{dx}", desc: "Derivative notation" },
        { name: "Đạo hàm riêng", latex: "\\frac{\\partial f}{\\partial x}", desc: "Partial derivative" },
        { name: "Tích phân / Integral", latex: "\\int_{a}^{b} f(x) \\, dx", desc: "Definite integral" },
        { name: "Tích phân bất định", latex: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C", desc: "Indefinite integral" },
        { name: "Tích phân kép", latex: "\\iint_D f(x,y) \\, dA", desc: "Double integral" },
        { name: "Tổng sigma", latex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}", desc: "Summation" },
        { name: "Tích pi", latex: "\\prod_{i=1}^{n} i = n!", desc: "Product notation" },
        { name: "Chuỗi Taylor", latex: "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}", desc: "Taylor series" },
    ],
    geometry: [
        { name: "Định lý Pythagoras", latex: "a^2 + b^2 = c^2", desc: "Pythagorean theorem" },
        { name: "Diện tích hình tròn", latex: "S = \\pi r^2", desc: "Circle area" },
        { name: "Chu vi hình tròn", latex: "C = 2\\pi r", desc: "Circle circumference" },
        { name: "Thể tích hình cầu", latex: "V = \\frac{4}{3}\\pi r^3", desc: "Sphere volume" },
        { name: "Diện tích tam giác", latex: "S = \\frac{1}{2}ah", desc: "Triangle area" },
        { name: "Góc / Angle", latex: "\\angle ABC = 90^\\circ", desc: "Angle notation" },
        { name: "Song song", latex: "AB \\parallel CD", desc: "Parallel lines" },
        { name: "Vuông góc", latex: "AB \\perp CD", desc: "Perpendicular" },
        { name: "Tam giác đồng dạng", latex: "\\triangle ABC \\sim \\triangle DEF", desc: "Similar triangles" },
    ],
    trigonometry: [
        { name: "Công thức cơ bản", latex: "\\sin^2\\theta + \\cos^2\\theta = 1", desc: "Pythagorean identity" },
        { name: "Tan và Cot", latex: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}", desc: "Tangent definition" },
        { name: "Sin góc kép", latex: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta", desc: "Double angle sin" },
        { name: "Cos góc kép", latex: "\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta", desc: "Double angle cos" },
        { name: "Định lý sin", latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}", desc: "Law of sines" },
        { name: "Định lý cos", latex: "c^2 = a^2 + b^2 - 2ab\\cos C", desc: "Law of cosines" },
    ],
    physics: [
        { name: "Einstein E=mc²", latex: "E = mc^2", desc: "Mass-energy equivalence" },
        { name: "Định luật Newton 2", latex: "F = ma", desc: "Newton's 2nd law" },
        { name: "Động năng", latex: "E_k = \\frac{1}{2}mv^2", desc: "Kinetic energy" },
        { name: "Thế năng", latex: "E_p = mgh", desc: "Potential energy" },
        { name: "Định luật Ohm", latex: "V = IR", desc: "Ohm's law" },
        { name: "Công suất điện", latex: "P = VI = I^2R = \\frac{V^2}{R}", desc: "Electric power" },
        { name: "Định luật hấp dẫn", latex: "F = G\\frac{m_1 m_2}{r^2}", desc: "Gravitational force" },
        { name: "Phương trình sóng", latex: "v = f\\lambda", desc: "Wave equation" },
        { name: "Schrödinger", latex: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi", desc: "Schrödinger equation" },
    ],
    chemistry: [
        { name: "Phương trình hóa học", latex: "2H_2 + O_2 \\rightarrow 2H_2O", desc: "Chemical equation" },
        { name: "Ion", latex: "Na^+ + Cl^- \\rightarrow NaCl", desc: "Ionic equation" },
        { name: "Cân bằng", latex: "A + B \\rightleftharpoons C + D", desc: "Equilibrium" },
        { name: "pH", latex: "pH = -\\log[H^+]", desc: "pH formula" },
        { name: "Nồng độ mol", latex: "C = \\frac{n}{V}", desc: "Molarity" },
        { name: "Số Avogadro", latex: "N_A = 6.022 \\times 10^{23}", desc: "Avogadro's number" },
    ],
    matrices: [
        { name: "Ma trận 2x2", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", desc: "2x2 matrix" },
        { name: "Ma trận 3x3", latex: "\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}", desc: "3x3 matrix" },
        { name: "Định thức", latex: "\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc", desc: "Determinant" },
        { name: "Ma trận đơn vị", latex: "I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}", desc: "Identity matrix" },
        { name: "Nhân ma trận", latex: "C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}", desc: "Matrix multiplication" },
        { name: "Vector", latex: "\\vec{v} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}", desc: "Column vector" },
    ],
    statistics: [
        { name: "Trung bình", latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i", desc: "Mean" },
        { name: "Phương sai", latex: "\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2", desc: "Variance" },
        { name: "Độ lệch chuẩn", latex: "\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}", desc: "Standard deviation" },
        { name: "Tổ hợp", latex: "C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}", desc: "Combination" },
        { name: "Chỉnh hợp", latex: "A_n^k = \\frac{n!}{(n-k)!}", desc: "Permutation" },
        { name: "Phân phối chuẩn", latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}", desc: "Normal distribution" },
    ],
    sets: [
        { name: "Thuộc / Element", latex: "x \\in A", desc: "Element of" },
        { name: "Không thuộc", latex: "x \\notin A", desc: "Not element of" },
        { name: "Tập con", latex: "A \\subset B", desc: "Subset" },
        { name: "Hợp / Union", latex: "A \\cup B", desc: "Union" },
        { name: "Giao / Intersection", latex: "A \\cap B", desc: "Intersection" },
        { name: "Hiệu / Difference", latex: "A \\setminus B", desc: "Set difference" },
        { name: "Tập rỗng", latex: "\\emptyset", desc: "Empty set" },
        { name: "Với mọi", latex: "\\forall x \\in \\mathbb{R}", desc: "For all" },
        { name: "Tồn tại", latex: "\\exists x : x > 0", desc: "There exists" },
        { name: "Tập số thực", latex: "\\mathbb{R}, \\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}", desc: "Number sets" },
    ],
    famous: [
        { name: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0", desc: "Most beautiful equation" },
        { name: "Gauss Integral", latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}", desc: "Gaussian integral" },
        { name: "Binomial Theorem", latex: "(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k", desc: "Binomial expansion" },
        { name: "Euler's Formula", latex: "e^{ix} = \\cos x + i\\sin x", desc: "Euler's formula" },
        { name: "Stirling", latex: "n! \\approx \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n", desc: "Stirling approximation" },
        { name: "Basel Problem", latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}", desc: "Basel problem" },
    ],
};

// Quick reference guide for LaTeX syntax
const LATEX_GUIDE = {
    en: [
        { syntax: "x^{2}", result: "x²", desc: "Superscript/Power" },
        { syntax: "x_{1}", result: "x₁", desc: "Subscript" },
        { syntax: "\\frac{a}{b}", result: "a/b", desc: "Fraction" },
        { syntax: "\\sqrt{x}", result: "√x", desc: "Square root" },
        { syntax: "\\sqrt[n]{x}", result: "ⁿ√x", desc: "N-th root" },
        { syntax: "\\sum_{i=1}^{n}", result: "Σ", desc: "Sum" },
        { syntax: "\\int_{a}^{b}", result: "∫", desc: "Integral" },
        { syntax: "\\lim_{x \\to a}", result: "lim", desc: "Limit" },
        { syntax: "\\alpha, \\beta, \\gamma", result: "α, β, γ", desc: "Greek letters" },
        { syntax: "\\sin, \\cos, \\tan", result: "sin, cos, tan", desc: "Trig functions" },
        { syntax: "\\times, \\div, \\pm", result: "×, ÷, ±", desc: "Operators" },
        { syntax: "\\leq, \\geq, \\neq", result: "≤, ≥, ≠", desc: "Comparisons" },
        { syntax: "\\rightarrow, \\Rightarrow", result: "→, ⇒", desc: "Arrows" },
        { syntax: "\\infty", result: "∞", desc: "Infinity" },
        { syntax: "\\left( \\right)", result: "( )", desc: "Auto-size brackets" },
    ],
    vi: [
        { syntax: "x^{2}", result: "x²", desc: "Số mũ / Lũy thừa" },
        { syntax: "x_{1}", result: "x₁", desc: "Chỉ số dưới" },
        { syntax: "\\frac{a}{b}", result: "a/b", desc: "Phân số" },
        { syntax: "\\sqrt{x}", result: "√x", desc: "Căn bậc 2" },
        { syntax: "\\sqrt[n]{x}", result: "ⁿ√x", desc: "Căn bậc n" },
        { syntax: "\\sum_{i=1}^{n}", result: "Σ", desc: "Tổng sigma" },
        { syntax: "\\int_{a}^{b}", result: "∫", desc: "Tích phân" },
        { syntax: "\\lim_{x \\to a}", result: "lim", desc: "Giới hạn" },
        { syntax: "\\alpha, \\beta, \\gamma", result: "α, β, γ", desc: "Chữ Hy Lạp" },
        { syntax: "\\sin, \\cos, \\tan", result: "sin, cos, tan", desc: "Hàm lượng giác" },
        { syntax: "\\times, \\div, \\pm", result: "×, ÷, ±", desc: "Toán tử" },
        { syntax: "\\leq, \\geq, \\neq", result: "≤, ≥, ≠", desc: "So sánh" },
        { syntax: "\\rightarrow, \\Rightarrow", result: "→, ⇒", desc: "Mũi tên" },
        { syntax: "\\infty", result: "∞", desc: "Vô cực" },
        { syntax: "\\left( \\right)", result: "( )", desc: "Ngoặc tự động" },
    ],
};

const EXAMPLE_CATEGORIES = {
    en: [
        { key: "exam", label: "🎓 School & Exam", desc: "High school & university exam formulas" },
        { key: "basic", label: "📝 Basic", desc: "Fractions, powers, roots" },
        { key: "algebra", label: "🔢 Algebra", desc: "Equations, formulas" },
        { key: "calculus", label: "📈 Calculus", desc: "Limits, derivatives, integrals" },
        { key: "geometry", label: "📐 Geometry", desc: "Shapes, theorems" },
        { key: "trigonometry", label: "📊 Trigonometry", desc: "Sin, cos, tan" },
        { key: "physics", label: "⚛️ Physics", desc: "Formulas, laws" },
        { key: "chemistry", label: "🧪 Chemistry", desc: "Equations, formulas" },
        { key: "matrices", label: "🔲 Matrices", desc: "Matrices, vectors" },
        { key: "statistics", label: "📉 Statistics", desc: "Mean, variance" },
        { key: "sets", label: "🔗 Sets", desc: "Set theory" },
        { key: "famous", label: "⭐ Famous", desc: "Famous equations" },
    ],
    vi: [
        { key: "exam", label: "🎓 Đề thi & Phổ thông", desc: "Công thức thi cử & đại học phổ biến" },
        { key: "basic", label: "📝 Cơ bản", desc: "Phân số, lũy thừa, căn" },
        { key: "algebra", label: "🔢 Đại số", desc: "Phương trình, công thức" },
        { key: "calculus", label: "📈 Giải tích", desc: "Giới hạn, đạo hàm, tích phân" },
        { key: "geometry", label: "📐 Hình học", desc: "Hình, định lý" },
        { key: "trigonometry", label: "📊 Lượng giác", desc: "Sin, cos, tan" },
        { key: "physics", label: "⚛️ Vật lý", desc: "Công thức, định luật" },
        { key: "chemistry", label: "🧪 Hóa học", desc: "Phương trình, công thức" },
        { key: "matrices", label: "🔲 Ma trận", desc: "Ma trận, vector" },
        { key: "statistics", label: "📉 Thống kê", desc: "Trung bình, phương sai" },
        { key: "sets", label: "🔗 Tập hợp", desc: "Lý thuyết tập hợp" },
        { key: "famous", label: "⭐ Nổi tiếng", desc: "Công thức nổi tiếng" },
    ],
};

export default function LaTeXClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale);
    const tool_t = t.tools.latexEditor;

    // Textarea ref for cursor position
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const [latex, setLatex] = useState("\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
    const [renderedHtml, setRenderedHtml] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [displayMode, setDisplayMode] = useState(true);
    const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
    const [activeSymbolTab, setActiveSymbolTab] = useState<string>("greekLower");
    const [activeTemplateTab, setActiveTemplateTab] = useState<string>("fractions");
    const [searchQuery, setSearchQuery] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [activeExampleCategory, setActiveExampleCategory] = useState<string>("basic");
    const [showGuide, setShowGuide] = useState(true);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    // Get localized data
    const guideData = LATEX_GUIDE[locale as keyof typeof LATEX_GUIDE] || LATEX_GUIDE.en;
    const categoryData = EXAMPLE_CATEGORIES[locale as keyof typeof EXAMPLE_CATEGORIES] || EXAMPLE_CATEGORIES.en;

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("latex-history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch {
                setHistory([]);
            }
        }
    }, []);

    // Render LaTeX
    useEffect(() => {
        if (!latex.trim()) {
            setRenderedHtml("");
            setError(null);
            return;
        }

        try {
            const html = katex.renderToString(latex, {
                throwOnError: true,
                displayMode: displayMode,
                output: "html",
            });
            setRenderedHtml(html);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid LaTeX");
            setRenderedHtml("");
        }
    }, [latex, displayMode]);

    // Font size class
    const fontSizeClass = useMemo(() => {
        switch (fontSize) {
            case "small":
                return "text-lg";
            case "large":
                return "text-4xl";
            default:
                return "text-2xl";
        }
    }, [fontSize]);

    // Insert text at cursor position
    const insertLatex = useCallback(
        (text: string) => {
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart ?? cursorPosition ?? latex.length;
                const end = textarea.selectionEnd ?? cursorPosition ?? latex.length;

                const newValue = latex.slice(0, start) + text + latex.slice(end);
                setLatex(newValue);

                // Set cursor position after inserted text
                const newCursorPos = start + text.length;
                setCursorPosition(newCursorPos);

                // Focus textarea and restore cursor position
                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
            } else {
                // Fallback: append to end
                setLatex((prev) => prev + text);
            }
        },
        [latex, cursorPosition]
    );

    // Copy to clipboard
    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Copy MathML
    const copyMathML = async () => {
        try {
            const mathml = katex.renderToString(latex, {
                throwOnError: true,
                displayMode: displayMode,
                output: "mathml",
            });
            await copyToClipboard(mathml, "mathml");
        } catch (err) {
            console.error("Failed to generate MathML:", err);
        }
    };

    // Extract KaTeX stylesheet styles for standalone SVG / Canvas rendering
    const getKaTeXStyles = useCallback(() => {
        let css = "";
        try {
            for (let i = 0; i < document.styleSheets.length; i++) {
                const sheet = document.styleSheets[i];
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.cssText && (rule.cssText.includes("katex") || rule.cssText.includes("KaTeX"))) {
                            css += rule.cssText + "\n";
                        }
                    }
                } catch {
                    // Ignore cross-origin sheet errors
                }
            }
        } catch {
            // ignore
        }
        return css;
    }, []);

    // Generate standalone SVG string containing the rendered KaTeX
    const generateSvgString = useCallback(() => {
        if (!previewContainerRef.current) return null;
        const rect = previewContainerRef.current.getBoundingClientRect();
        const width = Math.max(160, Math.ceil(rect.width) + 36);
        const height = Math.max(70, Math.ceil(rect.height) + 28);
        const katexStyles = getKaTeXStyles();
        const content = previewContainerRef.current.innerHTML;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <style type="text/css">
                    ${katexStyles}
                    .latex-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        background-color: #ffffff;
                        color: #111827;
                        font-family: KaTeX_Main, "Times New Roman", serif;
                        padding: 14px;
                        box-sizing: border-box;
                    }
                </style>
            </defs>
            <rect width="100%" height="100%" fill="#ffffff" rx="10" />
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" class="latex-container">
                    ${content}
                </div>
            </foreignObject>
        </svg>`.trim();
    }, [getKaTeXStyles]);

    // Render SVG into HTML Canvas
    const renderToCanvas = useCallback(
        async (scale = 2): Promise<HTMLCanvasElement | null> => {
            const svgStr = generateSvgString();
            if (!svgStr || !previewContainerRef.current) return null;
            const rect = previewContainerRef.current.getBoundingClientRect();
            const width = Math.max(160, Math.ceil(rect.width) + 36);
            const height = Math.max(70, Math.ceil(rect.height) + 28);

            const canvas = document.createElement("canvas");
            canvas.width = width * scale;
            canvas.height = height * scale;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const img = new Image();

            return new Promise((resolve) => {
                img.onload = () => {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(url);
                    resolve(canvas);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
                img.src = url;
            });
        },
        [generateSvgString]
    );

    // 1-Click Copy PNG Image to Clipboard
    const copyImageToClipboard = useCallback(async () => {
        try {
            const canvas = await renderToCanvas(2);
            if (!canvas) throw new Error("Canvas render failed");
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ "image/png": blob }),
                    ]);
                    setCopied("image");
                    setTimeout(() => setCopied(null), 2000);
                    toast.success(isVi ? "Đã chép ảnh PNG vào bộ nhớ tạm!" : "Copied formula PNG to clipboard!");
                } catch {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `latex-formula-${Date.now()}.png`;
                    a.click();
                    toast.info(isVi ? "Đã tải ảnh PNG về máy!" : "Downloaded PNG image!");
                }
            }, "image/png");
        } catch {
            toast.error(isVi ? "Không thể xuất ảnh" : "Failed to export image");
        }
    }, [renderToCanvas, isVi]);

    // Download High-Res PNG
    const downloadPng = useCallback(async () => {
        try {
            const canvas = await renderToCanvas(3);
            if (!canvas) return;
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `latex-formula-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(isVi ? "Đã tải ảnh PNG chất lượng cao!" : "High-res PNG downloaded!");
            }, "image/png");
        } catch {
            toast.error(isVi ? "Lỗi tải ảnh PNG" : "PNG download failed");
        }
    }, [renderToCanvas, isVi]);

    // Download Vector SVG
    const downloadSvg = useCallback(() => {
        try {
            const svgStr = generateSvgString();
            if (!svgStr) return;
            const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `latex-formula-${Date.now()}.svg`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(isVi ? "Đã tải vector SVG!" : "SVG vector downloaded!");
        } catch {
            toast.error(isVi ? "Lỗi tải SVG" : "SVG download failed");
        }
    }, [generateSvgString, isVi]);

    // Add to history
    const addToHistory = useCallback(() => {
        if (latex.trim() && !error) {
            setHistory((prev) => {
                const newHistory = [latex, ...prev.filter((h) => h !== latex)].slice(0, 20);
                localStorage.setItem("latex-history", JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, [latex, error]);

    // Clear history
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("latex-history");
    };

    // Filter symbols by search
    const filteredSymbols = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();
        const results: Array<{ symbol: string; latex: string; name: string; category: string }> = [];

        Object.entries(LATEX_SYMBOLS).forEach(([category, symbols]) => {
            symbols.forEach((s) => {
                if (s.name.toLowerCase().includes(query) || s.latex.toLowerCase().includes(query) || s.symbol.includes(query)) {
                    results.push({ ...s, category });
                }
            });
        });

        return results;
    }, [searchQuery]);

    // Symbol tabs
    const symbolTabs = [
        { key: "greekLower", label: "α β γ" },
        { key: "greekUpper", label: "Γ Δ Θ" },
        { key: "operators", label: "× ÷ ±" },
        { key: "relations", label: "≤ ≥ ≈" },
        { key: "arrows", label: "→ ← ↔" },
        { key: "misc", label: "∞ ∂ ∇" },
    ];

    // Template tabs
    const templateTabs = [
        { key: "fractions", label: "a/b" },
        { key: "roots", label: "√x" },
        { key: "powers", label: "xⁿ" },
        { key: "sums", label: "Σ" },
        { key: "integrals", label: "∫" },
        { key: "limits", label: "lim" },
        { key: "functions", label: "sin" },
        { key: "brackets", label: "()" },
        { key: "matrices", label: "[]" },
        { key: "special", label: "ˆ~" },
    ];

    return (
        <div className='space-y-4 max-w-7xl mx-auto'>
            {/* Main Editor Card - Side by Side Layout */}
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                {/* Editor Controls */}
                <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
                    <div className='flex items-center gap-2'>
                        {/* Display Mode Toggle */}
                        <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
                            <button onClick={() => setDisplayMode(false)} className={`px-2 py-1 text-xs rounded transition-colors ${!displayMode ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                {tool_t.inline}
                            </button>
                            <button onClick={() => setDisplayMode(true)} className={`px-2 py-1 text-xs rounded transition-colors ${displayMode ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                {tool_t.display}
                            </button>
                        </div>
                        {/* Font Size */}
                        <select value={fontSize} onChange={(e) => setFontSize(e.target.value as "small" | "medium" | "large")} className='px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                            <option value='small'>{tool_t.small}</option>
                            <option value='medium'>{tool_t.medium}</option>
                            <option value='large'>{tool_t.large}</option>
                        </select>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <button onClick={() => copyToClipboard(latex, "latex")} disabled={!latex.trim() || !!error} className='px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                            {copied === "latex" ? `✅ ${tool_t.copied}` : `📋 ${tool_t.copy}`}
                        </button>
                        <button onClick={copyMathML} disabled={!latex.trim() || !!error} className='px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                            {copied === "mathml" ? `✅ ${tool_t.copied}` : `📄 ${tool_t.copyMathML}`}
                        </button>
                        <button onClick={copyImageToClipboard} disabled={!latex.trim() || !!error} className='px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1' title={tool_t.copyImage}>
                            <span>📸</span>
                            <span>{copied === "image" ? `✅ ${tool_t.copied}` : tool_t.copyImage}</span>
                        </button>
                        <button onClick={downloadPng} disabled={!latex.trim() || !!error} className='px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer' title={tool_t.downloadPng}>
                            💾 PNG
                        </button>
                        <button onClick={downloadSvg} disabled={!latex.trim() || !!error} className='px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer' title={tool_t.downloadSvg}>
                            ⚡ SVG
                        </button>
                        <button onClick={() => setLatex("")} className='px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors font-medium cursor-pointer'>
                            🗑️ {tool_t.clear}
                        </button>
                    </div>
                </div>

                {/* Side by Side: Input & Preview */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
                    {/* Input Section */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.inputLabel}</label>
                        <textarea
                            ref={textareaRef}
                            value={latex}
                            onChange={(e) => {
                                setLatex(e.target.value);
                                setCursorPosition(e.target.selectionStart);
                            }}
                            onSelect={(e) => {
                                setCursorPosition((e.target as HTMLTextAreaElement).selectionStart);
                            }}
                            onClick={(e) => {
                                setCursorPosition((e.target as HTMLTextAreaElement).selectionStart);
                            }}
                            onKeyUp={(e) => {
                                setCursorPosition((e.target as HTMLTextAreaElement).selectionStart);
                            }}
                            onBlur={addToHistory}
                            placeholder={tool_t.inputPlaceholder}
                            className='flex-1 min-h-40 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                            spellCheck={false}
                        />
                    </div>

                    {/* Preview Section */}
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.preview}</label>
                        <div className={`flex-1 min-h-40 p-6 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 flex items-center justify-center ${fontSizeClass}`}>
                            {error ? (
                                <div className='text-red-500 text-sm text-center'>
                                    <span className='font-semibold'>Error:</span> {error}
                                </div>
                            ) : renderedHtml ? (
                                <div ref={previewContainerRef} dangerouslySetInnerHTML={{ __html: renderedHtml }} className='overflow-x-auto max-w-full katex-display-wrapper text-gray-900 dark:text-gray-100' />
                            ) : (
                                <span className='text-gray-400 dark:text-gray-500 text-sm'>{tool_t.previewHint}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Insert - Symbols */}
                <div className='mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.symbols}</label>
                        <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={tool_t.searchSymbols} className='px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-40 focus:outline-none focus:ring-1 focus:ring-blue-500' />
                    </div>

                    {/* Symbol Tabs */}
                    {!searchQuery && (
                        <div className='flex flex-wrap gap-1 mb-2'>
                            {symbolTabs.map((tab) => (
                                <button key={tab.key} onClick={() => setActiveSymbolTab(tab.key)} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${activeSymbolTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Symbol Grid */}
                    <div className='flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-32 overflow-y-auto'>
                        {searchQuery ? (
                            filteredSymbols && filteredSymbols.length > 0 ? (
                                filteredSymbols.map((s, i) => (
                                    <button key={i} onClick={() => insertLatex(s.latex)} title={`${s.name} - ${s.latex}`} className='px-3 py-2 flex items-center justify-center text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-gray-900 dark:text-gray-100'>
                                        {s.symbol}
                                    </button>
                                ))
                            ) : (
                                <span className='text-sm text-gray-500 p-2'>{tool_t.noResults}</span>
                            )
                        ) : (
                            LATEX_SYMBOLS[activeSymbolTab as keyof typeof LATEX_SYMBOLS]?.map((s, i) => (
                                <button key={i} onClick={() => insertLatex(s.latex)} title={`${s.name} - ${s.latex}`} className='px-3 py-2 flex items-center justify-center text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-gray-900 dark:text-gray-100'>
                                    {s.symbol}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Insert - Templates */}
                <div className='mb-4'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>{tool_t.templates}</label>

                    {/* Template Tabs */}
                    <div className='flex flex-wrap gap-1 mb-2'>
                        {templateTabs.map((tab) => (
                            <button key={tab.key} onClick={() => setActiveTemplateTab(tab.key)} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${activeTemplateTab === tab.key ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className='flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                        {LATEX_TEMPLATES[activeTemplateTab as keyof typeof LATEX_TEMPLATES]?.map((template, i) => {
                            let previewHtml = "";
                            try {
                                previewHtml = katex.renderToString(template.preview, { throwOnError: false, displayMode: false });
                            } catch {
                                previewHtml = template.label;
                            }
                            return (
                                <button key={i} onClick={() => insertLatex(template.latex)} title={template.latex} className='flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-600 transition-colors text-gray-900 dark:text-gray-100'>
                                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} className='text-base katex-preview' />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Reference Guide */}
                <div className='mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>📖 {locale === "vi" ? "Hướng Dẫn Nhanh" : "Quick Reference"}</label>
                        <button onClick={() => setShowGuide(!showGuide)} className='px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                            {showGuide ? (locale === "vi" ? "Ẩn" : "Hide") : locale === "vi" ? "Hiện" : "Show"}
                        </button>
                    </div>

                    {showGuide && (
                        <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-3 overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-gray-200 dark:border-gray-700'>
                                        <th className='text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium'>{locale === "vi" ? "Cú pháp" : "Syntax"}</th>
                                        <th className='text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium'>{locale === "vi" ? "Kết quả" : "Result"}</th>
                                        <th className='text-left py-2 px-2 text-gray-700 dark:text-gray-300 font-medium'>{locale === "vi" ? "Mô tả" : "Description"}</th>
                                        <th className='py-2 px-2'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guideData.map((item, i) => (
                                        <tr key={i} className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'>
                                            <td className='py-2 px-2 font-mono text-xs text-blue-600 dark:text-blue-400'>{item.syntax}</td>
                                            <td className='py-2 px-2 text-gray-900 dark:text-gray-100'>{item.result}</td>
                                            <td className='py-2 px-2 text-gray-600 dark:text-gray-400 text-xs'>{item.desc}</td>
                                            <td className='py-2 px-2'>
                                                <button onClick={() => insertLatex(item.syntax.split(",")[0].trim())} className='px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50'>
                                                    +
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Examples by Category */}
                <div className='mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.examples}</label>
                        <button onClick={() => setShowHistory(!showHistory)} className='px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                            📜 {tool_t.history} ({history.length})
                        </button>
                    </div>

                    {showHistory ? (
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-64 overflow-y-auto'>
                            {history.length > 0 ? (
                                <>
                                    <div className='flex justify-end mb-2'>
                                        <button onClick={clearHistory} className='text-xs text-red-500 hover:text-red-600'>
                                            {tool_t.clearHistory}
                                        </button>
                                    </div>
                                    <div className='space-y-2'>
                                        {history.map((h, i) => {
                                            let previewHtml = "";
                                            try {
                                                previewHtml = katex.renderToString(h, { throwOnError: false, displayMode: false });
                                            } catch {
                                                previewHtml = h;
                                            }
                                            return (
                                                <button key={i} onClick={() => setLatex(h)} className='w-full p-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-gray-900 dark:text-gray-100'>
                                                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} className='text-sm overflow-hidden katex-preview' />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <span className='text-sm text-gray-500 p-2'>{tool_t.noHistory}</span>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Category Tabs */}
                            <div className='flex flex-wrap gap-1 mb-2'>
                                {categoryData.map((cat) => (
                                    <button key={cat.key} onClick={() => setActiveExampleCategory(cat.key)} title={cat.desc} className={`px-2 py-1 text-xs rounded-lg transition-colors ${activeExampleCategory === cat.key ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Examples Grid */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-64 overflow-y-auto'>
                                {EXAMPLE_EQUATIONS[activeExampleCategory as keyof typeof EXAMPLE_EQUATIONS]?.map((example, i) => {
                                    let previewHtml = "";
                                    try {
                                        previewHtml = katex.renderToString(example.latex, { throwOnError: false, displayMode: false });
                                    } catch {
                                        previewHtml = example.name;
                                    }
                                    return (
                                        <button key={i} onClick={() => setLatex(example.latex)} className='flex flex-col items-start p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-600 transition-colors text-left h-full'>
                                            <div className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>{example.name}</div>
                                            <div className='flex-1 flex items-center justify-center w-full min-h-10'>
                                                <div dangerouslySetInnerHTML={{ __html: previewHtml }} className='katex-preview text-gray-900 dark:text-gray-100' />
                                            </div>
                                            <div className='mt-2 w-full'>
                                                <span className='text-xs text-gray-400 dark:text-gray-500 font-mono block truncate' title={example.latex}>
                                                    {example.latex.substring(0, 35)}
                                                    {example.latex.length > 35 ? "..." : ""}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
