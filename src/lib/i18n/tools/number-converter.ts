export const numberConverterTranslations = {
    en: {
        numberConverter: {
            ui: {
                inputLabel: "Input Value",
                inputPlaceholder: "Enter a number...",
                binaryLabel: "Binary (Base 2)",
                decimalLabel: "Decimal (Base 10)",
                hexLabel: "Hexadecimal (Base 16)",
                octalLabel: "Octal (Base 8)",
                copyButton: "Copy",
                copiedButton: "Copied!",
                clearButton: "Clear All",

                // Bitwise Operations
                bitwiseTitle: "Bitwise Operations",
                operation: "Operation",
                operand1: "First Number",
                operand2: "Second Number",
                result: "Result",
                calculate: "Calculate",

                // Operations
                and: "AND (&)",
                or: "OR (|)",
                xor: "XOR (^)",
                not: "NOT (~)",
                leftShift: "Left Shift (<<)",
                rightShift: "Right Shift (>>)",
                unsignedRightShift: "Unsigned Right Shift (>>>)",

                // Arithmetic Operations
                arithmeticTitle: "Binary Arithmetic",
                add: "Add (+)",
                subtract: "Subtract (-)",
                multiply: "Multiply (*)",
                divide: "Divide (/)",
                modulo: "Modulo (%)",

                shiftAmount: "Shift Amount",
                bits: "bits",

                // Info
                binaryRep: "Binary Representation",
                decimalValue: "Decimal Value",
                hexValue: "Hex Value",
                octalValue: "Octal Value",

                // Bitwise Explainer
                explainerTitle: "Detailed Bit-Level Calculations",
                inputBase: "Input Base",
                bitWidth: "Bit Width",
                firstNumber: "First Number",
                secondNumber: "Second Number",
                explainDetail: "Explain in Detail",
                binary2: "Binary (2)",
                octal8: "Octal (8)",
                decimal10: "Decimal (10)",
                hex16: "Hexadecimal (16)",
                arithmeticGroup: "Arithmetic",
                bitwiseGroup: "Bitwise",
                addOp: "Add (+)",
                subtractOp: "Subtract (-)",
                multiplyOp: "Multiply (*)",
                divideOp: "Divide (/)",
                andOp: "AND (&)",
                orOp: "OR (|)",
                xorOp: "XOR (^)",
                bitLevelDetail: "Bit-level breakdown:",
                cpuExecution: "How CPU executes:",

                // CPU Explanations
                cpuAdd1: "ALU (Arithmetic Logic Unit) uses Full Adder circuit",
                cpuAdd2: "Each Full Adder processes 1 bit + carry from previous bit",
                cpuAdd3: "Full Adders process in parallel in 1 clock cycle",
                cpuAdd4: "Carry propagation determines speed (Carry Look-ahead for optimization)",

                cpuSubtract1: "CPU converts subtraction to addition using Two's Complement",
                cpuSubtract2: "Two's complement: Invert bits + add 1 (reuses Full Adder circuit)",
                cpuSubtract3: "Saves hardware (no separate subtraction circuit needed)",
                cpuSubtract4: "Overflow occurs when result sign is wrong (MSB check)",

                cpuMultiply1: "Uses Booth's Algorithm or Shift-Add method",
                cpuMultiply2: "Each bit multiplies with multiplicand → partial product",
                cpuMultiply3: "Shift left partial products according to bit position",
                cpuMultiply4: "Sum all partial products (takes multiple cycles)",
                cpuMultiply5: "Modern CPUs use Wallace Tree for parallelization",

                cpuDivide1: "Slowest operation (10-40 cycles)",
                cpuDivide2: "Uses Restoring Division or Non-restoring algorithm",
                cpuDivide3: "Shift-subtract repeats for each quotient bit",
                cpuDivide4: "Some CPUs have dedicated FPU for division",

                cpuBitwise1: "Fastest - only 1 clock cycle",
                cpuBitwise2: "logic gates process all bits in parallel",
                cpuBitwise3: "No carry/borrow between bits",
                cpuBitwise4: "Used in masking, flags, cryptography",
            },
            page: {
                title: "Number System Converter & Bitwise Calculator",
                subtitle: "Convert between number systems and perform bitwise operations instantly",

                whatIs: "What is Number System Converter?",
                whatIsDesc:
                    "A Number System Converter is a tool that converts numbers between different bases (radix) including binary (base 2), decimal (base 10), hexadecimal (base 16), and octal (base 8). This tool is essential for programmers, computer science students, and anyone working with different number representations. Understanding number systems is fundamental in computer science as computers internally use binary, while programmers often work with hexadecimal for memory addresses and octal for file permissions.",

                whyImportant: "Why Number Systems Matter in Computing",
                whyImportantDesc:
                    "Different number systems serve specific purposes in computing. Binary is the foundation of all digital electronics and computer operations. Hexadecimal provides a more compact representation of binary data and is commonly used in memory addresses, color codes, and debugging. Octal is used in Unix file permissions. Understanding these systems is crucial for low-level programming, debugging, network programming, and understanding how computers store and process data.",

                numberSystems: "Number Systems Explained",
                binary: "Binary (Base 2): Uses only 0 and 1. Each digit represents a power of 2. Example: 1010₂ = 10₁₀",
                decimal: "Decimal (Base 10): Standard number system using digits 0-9. Each position represents a power of 10.",
                hexadecimal: "Hexadecimal (Base 16): Uses 0-9 and A-F. Compact representation of binary. Example: FF₁₆ = 255₁₀",
                octal: "Octal (Base 8): Uses digits 0-7. Each digit represents 3 binary bits. Example: 377₈ = 255₁₀",

                bitwiseOps: "Bitwise Operations",
                bitwiseDesc: "Bitwise operations manipulate individual bits of binary numbers. These operations are extremely fast and commonly used in low-level programming, cryptography, graphics, and optimization.",

                andOp: "AND (&): Returns 1 if both bits are 1. Example: 1010 & 1100 = 1000. Used for masking bits.",
                orOp: "OR (|): Returns 1 if at least one bit is 1. Example: 1010 | 1100 = 1110. Used for setting bits.",
                xorOp: "XOR (^): Returns 1 if bits are different. Example: 1010 ^ 1100 = 0110. Used for toggling and encryption.",
                notOp: "NOT (~): Inverts all bits. Example: ~1010 = 0101. One's complement operation.",
                leftShiftOp: "Left Shift (<<): Shifts bits left, fills with 0. Example: 1010 << 2 = 101000. Multiplies by 2ⁿ.",
                rightShiftOp: "Right Shift (>>): Shifts bits right, preserves sign. Example: 1010 >> 2 = 0010. Divides by 2ⁿ.",
                unsignedRightShiftOp: "Unsigned Right Shift (>>>): Shifts right, fills with 0. Ignores sign bit.",

                numberRepresentation: "Number Representation in Computer",
                representationDesc: "Computers represent numbers using different encoding schemes depending on whether the number is signed, unsigned, or floating-point. Understanding these representations is crucial for low-level programming and avoiding bugs.",

                unsignedInt: "Unsigned Integer: Simple binary representation. 8-bit range: 0 to 255. Example: 11111111₂ = 255",
                signedMagnitude: "Sign-Magnitude: MSB for sign (0=positive, 1=negative). Example: 8-bit -5 = 10000101. Problem: Two zeros (+0, -0)",
                onesComplement: "One's Complement: Negate by inverting bits. Example: -5 = ~00000101 = 11111010. Still has two zeros.",
                twosComplement: "Two's Complement (Most Common): Negate by inverting bits + 1. Example: -5 = ~00000101 + 1 = 11111011. Range: -128 to 127 (8-bit). Only one zero. Addition/subtraction use same circuit.",
                excessK: "Excess-K (Biased): Add bias (2^(n-1)) to value. Used in IEEE 754 exponent. Example: Excess-127 for float exponent.",
                ieee754: "IEEE 754 Floating-Point: Sign(1) + Exponent(8) + Mantissa(23) for 32-bit float. Example: -12.5 = 1 10000010 10010000...00",

                twosComplementSteps: "Two's Complement Calculation",
                step1: "Step 1: Write positive number in binary",
                step2: "Step 2: Invert all bits (0→1, 1→0)",
                step3: "Step 3: Add 1 to the result",
                step4Example: "Example: -12 in 8-bit\n1. 12 = 00001100\n2. Invert: 11110011\n3. Add 1: 11110100 = -12",

                cpuArithmetic: "How CPU Performs Arithmetic",
                cpuDesc: "Modern CPUs use specialized hardware circuits for arithmetic. Understanding this helps optimize code and avoid pitfalls.",

                aluDescription: "ALU (Arithmetic Logic Unit): Core component performing arithmetic and logic operations. Contains adders, subtractors, multipliers, shifters.",
                fullAdder: "Full Adder Circuit: Basic building block for addition. Inputs: A, B, Carry-in. Outputs: Sum, Carry-out. Formula: Sum=A⊕B⊕Cin, Cout=(A∧B)∨(Cin∧(A⊕B))",
                carryLookahead: "Carry Look-ahead Adder: Speeds up addition by computing all carries in parallel instead of ripple. Reduces delay from O(n) to O(log n).",
                boothMultiplier: "Booth's Algorithm: Efficient multiplication. Reduces partial products by encoding multiplier bits. Example: 0011→+A, 0111→+2A-A",
                divisionAlgo: "Division Algorithms: Restoring (slower, simpler), Non-restoring (faster), SRT (used in Pentium). Takes 10-40 cycles.",
                floatingPoint: "Floating-Point Unit (FPU): Separate hardware for IEEE 754. Handles normalization, rounding, special values (NaN, Infinity). Much slower than integer ops.",

                useCases: "Common Use Cases",
                use1: "Programming: Low-level operations, bit manipulation, flags, permissions",
                use2: "Networking: IP addresses, subnet masks, packet analysis",
                use3: "Graphics: Color manipulation (RGB values), image processing",
                use4: "Cryptography: Encryption algorithms, hash functions",
                use5: "Embedded Systems: Hardware register manipulation, I/O control",
                use6: "Data Compression: Huffman coding, run-length encoding",
                use7: "Game Development: Collision detection, state management",
                use8: "Database: Bitwise indexes, flag storage optimization",

                conversions: "Conversion Examples",
                conv1: "Binary to Decimal: 11010₂ = 1×16 + 1×8 + 0×4 + 1×2 + 0×1 = 26₁₀",
                conv2: "Decimal to Binary: 26₁₀ = 16 + 8 + 2 = 11010₂",
                conv3: "Hexadecimal to Decimal: 1A₁₆ = 1×16 + 10 = 26₁₀",
                conv4: "Binary to Hexadecimal: 11010₂ = 1A₁₆ (group 4 bits)",
                conv5: "Octal to Binary: 32₈ = 011010₂ (3 bits per digit)",
                conv6: "Decimal to Hexadecimal: 255₁₀ = FF₁₆",

                bestPractices: "Best Practices",
                practice1: "Understand bit positions and powers of 2 for quick mental conversions",
                practice2: "Use hexadecimal for compact binary representation (4 bits per digit)",
                practice3: "Remember: left shift multiplies by 2, right shift divides by 2",
                practice4: "Use AND for extracting specific bits (masking)",
                practice5: "Use OR for setting specific bits to 1",
                practice6: "Use XOR for toggling bits or simple encryption",
                practice7: "Be aware of overflow in bitwise operations with large numbers",
                practice8: "Test edge cases: 0, maximum values, negative numbers",

                performance: "Performance Considerations",
                performanceDesc: "Bitwise operations are among the fastest CPU operations, often completing in a single clock cycle. They're used for optimization in performance-critical code. Shifting is faster than multiplication/division by powers of 2. Bit manipulation can reduce memory usage by packing multiple boolean flags into a single integer.",

                applications: "Real-World Applications",
                app1: "File Permissions (Unix): rwxr-xr-x = 755₈ uses octal for permission bits",
                app2: "IP Subnetting: 255.255.255.0 = /24 uses binary for network masks",
                app3: "RGB Colors: #FF5733 uses hex for red, green, blue values",
                app4: "Bit Flags: enum { READ=1, WRITE=2, EXECUTE=4 } allows combining permissions",
                app5: "Checksum Calculation: XOR operations for error detection",
                app6: "UUID Generation: Hex representation of 128-bit identifiers",

                tips: "Quick Tips",
                tip1: "Binary: Count from right, each position doubles (1, 2, 4, 8, 16...)",
                tip2: "Hex: F = 15, A = 10. Each hex digit = 4 binary bits",
                tip3: "Octal: Each digit = 3 binary bits. Used in file permissions",
                tip4: "Powers of 2: 2⁸=256, 2¹⁰=1024 (1K), 2¹⁶=65536 (64K)",
                tip5: "Negative binary: Two's complement = invert bits and add 1",
                tip6: "Quick check: If last bit is 1, number is odd",

                faq: "Frequently Asked Questions",
                q1: "Why do programmers use hexadecimal?",
                a1: "Hexadecimal provides a compact way to represent binary data. Each hex digit represents exactly 4 binary bits, making it easier to read and write than long binary strings. It's widely used in memory addresses, color codes, and debugging.",

                q2: "How do bitwise operations work?",
                a2: "Bitwise operations work on individual bits of numbers. AND (&) outputs 1 only if both bits are 1. OR (|) outputs 1 if at least one bit is 1. XOR (^) outputs 1 if bits are different. NOT (~) inverts all bits. Shift operations move bits left or right.",

                q3: "What's the difference between >> and >>>?",
                a3: "The >> operator is arithmetic right shift which preserves the sign bit (fills with sign bit). The >>> operator is logical/unsigned right shift which always fills with 0. This matters for negative numbers in two's complement representation.",

                q4: "How to convert between binary and hexadecimal quickly?",
                a4: "Group binary digits in sets of 4 from right to left. Each group of 4 bits equals one hexadecimal digit. Example: 11010110₂ = 1101 0110 = D6₁₆. This works because 16 = 2⁴.",

                q5: "What are practical uses of XOR?",
                a5: "XOR is used for: toggling bits, swapping variables without temp storage, simple encryption, checksum calculations, finding unique elements, and detecting bit differences. It's a key operation in many algorithms.",

                q6: "Why is octal still used?",
                a6: "Octal is primarily used in Unix/Linux file permissions (read=4, write=2, execute=1). It provides a compact representation where each digit represents 3 bits, making it natural for representing permission triplets (user, group, others).",

                q7: "How do I handle negative numbers in binary?",
                a7: "Most systems use two's complement: invert all bits and add 1. Example: -5 in 8-bit = ~00000101 + 1 = 11111010 + 1 = 11111011. The leftmost bit indicates sign (1=negative).",

                q8: "What's the maximum value in different systems?",
                a8: "For n bits: Binary max = 2ⁿ-1 (unsigned). 8-bit = 255, 16-bit = 65535, 32-bit = 4294967295. Signed uses one bit for sign, so max = 2ⁿ⁻¹-1. Example: signed 8-bit max = 127.",
            },
        },
    },
    vi: {
        numberConverter: {
            ui: {
                inputLabel: "Giá trị đầu vào",
                inputPlaceholder: "Nhập số...",
                binaryLabel: "Nhị phân (Cơ số 2)",
                decimalLabel: "Thập phân (Cơ số 10)",
                hexLabel: "Thập lục phân (Cơ số 16)",
                octalLabel: "Bát phân (Cơ số 8)",
                copyButton: "Sao chép",
                copiedButton: "Đã sao chép!",
                clearButton: "Xóa tất cả",

                bitwiseTitle: "Phép toán Bitwise",
                operation: "Phép toán",
                operand1: "Số thứ nhất",
                operand2: "Số thứ hai",
                result: "Kết quả",
                calculate: "Tính toán",

                and: "AND (&)",
                or: "OR (|)",
                xor: "XOR (^)",
                not: "NOT (~)",
                leftShift: "Dịch trái (<<)",
                rightShift: "Dịch phải (>>)",
                unsignedRightShift: "Dịch phải không dấu (>>>)",

                arithmeticTitle: "Số học nhị phân",
                add: "Cộng (+)",
                subtract: "Trừ (-)",
                multiply: "Nhân (*)",
                divide: "Chia (/)",
                modulo: "Chia lấy dư (%)",

                shiftAmount: "Số bit dịch",
                bits: "bits",

                binaryRep: "Biểu diễn nhị phân",
                decimalValue: "Giá trị thập phân",
                hexValue: "Giá trị hex",
                octalValue: "Giá trị bát phân",

                // Bitwise Explainer
                explainerTitle: "Chi tiết phép toán ở mức Bit",
                inputBase: "Hệ số đầu vào",
                bitWidth: "Độ rộng bit",
                firstNumber: "Số thứ nhất",
                secondNumber: "Số thứ hai",
                explainDetail: "Giải thích chi tiết",
                binary2: "Nhị phân (2)",
                octal8: "Bát phân (8)",
                decimal10: "Thập phân (10)",
                hex16: "Hex (16)",
                arithmeticGroup: "Số học",
                bitwiseGroup: "Bitwise",
                addOp: "Cộng (+)",
                subtractOp: "Trừ (-)",
                multiplyOp: "Nhân (*)",
                divideOp: "Chia (/)",
                andOp: "AND (&)",
                orOp: "OR (|)",
                xorOp: "XOR (^)",
                bitLevelDetail: "Chi tiết từng bit:",
                cpuExecution: "Cách CPU thực hiện:",

                // CPU Explanations
                cpuAdd1: "ALU (Arithmetic Logic Unit) sử dụng Full Adder circuit",
                cpuAdd2: "Mỗi Full Adder xử lý 1 bit + carry từ bit trước",
                cpuAdd3: "Full Adders xử lý song song trong 1 clock cycle",
                cpuAdd4: "Carry propagation quyết định tốc độ (Carry Look-ahead để tăng tốc)",

                cpuSubtract1: "CPU chuyển phép trừ thành phép cộng với Two's Complement",
                cpuSubtract2: "Bù 2: Đảo bit + cộng 1 (dùng lại mạch Full Adder)",
                cpuSubtract3: "Tiết kiệm phần cứng (không cần mạch trừ riêng)",
                cpuSubtract4: "Overflow xảy ra khi dấu kết quả sai (MSB check)",

                cpuMultiply1: "Sử dụng Booth's Algorithm hoặc Shift-Add",
                cpuMultiply2: "Mỗi bit nhân với multiplicand → partial product",
                cpuMultiply3: "Shift left partial products theo vị trí bit",
                cpuMultiply4: "Cộng tất cả partial products (mất nhiều cycles)",
                cpuMultiply5: "CPU hiện đại dùng Wallace Tree để song song hóa",

                cpuDivide1: "Chậm nhất trong các phép toán (10-40 cycles)",
                cpuDivide2: "Sử dụng Restoring Division hoặc Non-restoring",
                cpuDivide3: "Shift-subtract lặp lại cho mỗi bit quotient",
                cpuDivide4: "Một số CPU có FPU riêng cho division",

                cpuBitwise1: "Nhanh nhất - chỉ 1 clock cycle",
                cpuBitwise2: "logic gates xử lý song song tất cả bit",
                cpuBitwise3: "Không có carry/borrow giữa các bit",
                cpuBitwise4: "Dùng trong masking, flags, cryptography",
            },
            page: {
                title: "Chuyển đổi hệ số & Máy tính Bitwise",
                subtitle: "Chuyển đổi giữa các hệ số và thực hiện phép toán bitwise ngay lập tức",

                whatIs: "Công cụ chuyển đổi hệ số là gì?",
                whatIsDesc:
                    "Công cụ chuyển đổi hệ số là một tool giúp chuyển đổi số giữa các hệ cơ số khác nhau bao gồm nhị phân (cơ số 2), thập phân (cơ số 10), thập lục phân (cơ số 16) và bát phân (cơ số 8). Tool này rất quan trọng cho lập trình viên, sinh viên khoa học máy tính và bất kỳ ai làm việc với các biểu diễn số khác nhau. Hiểu các hệ số là nền tảng trong khoa học máy tính vì máy tính sử dụng nhị phân nội bộ, trong khi lập trình viên thường làm việc với hex cho địa chỉ bộ nhớ và octal cho quyền file.",

                whyImportant: "Tại sao hệ số quan trọng trong máy tính",
                whyImportantDesc: "Các hệ số khác nhau phục vụ mục đích cụ thể trong máy tính. Nhị phân là nền tảng của tất cả điện tử số và hoạt động máy tính. Hex cung cấp biểu diễn compact của dữ liệu nhị phân và thường dùng trong địa chỉ bộ nhớ, mã màu và debug. Octal được dùng trong quyền file Unix. Hiểu các hệ này rất quan trọng cho lập trình low-level, debug, lập trình mạng và hiểu cách máy tính lưu trữ và xử lý dữ liệu.",

                numberSystems: "Giải thích các hệ số",
                binary: "Nhị phân (Cơ số 2): Chỉ dùng 0 và 1. Mỗi chữ số đại diện lũy thừa của 2. Ví dụ: 1010₂ = 10₁₀",
                decimal: "Thập phân (Cơ số 10): Hệ số chuẩn dùng chữ số 0-9. Mỗi vị trí đại diện lũy thừa của 10.",
                hexadecimal: "Hex (Cơ số 16): Dùng 0-9 và A-F. Biểu diễn compact của nhị phân. Ví dụ: FF₁₆ = 255₁₀",
                octal: "Bát phân (Cơ số 8): Dùng chữ số 0-7. Mỗi chữ số đại diện 3 bit nhị phân. Ví dụ: 377₈ = 255₁₀",

                bitwiseOps: "Phép toán Bitwise",
                bitwiseDesc: "Phép toán bitwise thao tác trên từng bit của số nhị phân. Các phép toán này cực kỳ nhanh và thường dùng trong lập trình low-level, mã hóa, đồ họa và tối ưu hóa.",

                andOp: "AND (&): Trả về 1 nếu cả 2 bit là 1. Ví dụ: 1010 & 1100 = 1000. Dùng để mask bit.",
                orOp: "OR (|): Trả về 1 nếu ít nhất 1 bit là 1. Ví dụ: 1010 | 1100 = 1110. Dùng để set bit.",
                xorOp: "XOR (^): Trả về 1 nếu các bit khác nhau. Ví dụ: 1010 ^ 1100 = 0110. Dùng để toggle và mã hóa.",
                notOp: "NOT (~): Đảo tất cả bit. Ví dụ: ~1010 = 0101. Phép bù 1.",
                leftShiftOp: "Dịch trái (<<): Dịch bit sang trái, điền 0. Ví dụ: 1010 << 2 = 101000. Nhân với 2ⁿ.",
                rightShiftOp: "Dịch phải (>>): Dịch bit sang phải, giữ dấu. Ví dụ: 1010 >> 2 = 0010. Chia cho 2ⁿ.",
                unsignedRightShiftOp: "Dịch phải không dấu (>>>): Dịch phải, điền 0. Bỏ qua bit dấu.",

                numberRepresentation: "Biểu diễn số trong máy tính",
                representationDesc: "Máy tính biểu diễn số bằng các phương pháp mã hóa khác nhau tùy thuộc số có dấu, không dấu hay số thực. Hiểu các cách biểu diễn này rất quan trọng cho lập trình low-level và tránh bug.",

                unsignedInt: "Số nguyên không dấu: Biểu diễn nhị phân đơn giản. Phạm vi 8-bit: 0 đến 255. Ví dụ: 11111111₂ = 255",
                signedMagnitude: "Dấu - Độ lớn: MSB cho dấu (0=dương, 1=âm). Ví dụ: 8-bit -5 = 10000101. Vấn đề: Hai số 0 (+0, -0)",
                onesComplement: "Bù 1: Đảo bit để tạo số âm. Ví dụ: -5 = ~00000101 = 11111010. Vẫn có hai số 0.",
                twosComplement: "Bù 2 (Phổ biến nhất): Đảo bit + 1. Ví dụ: -5 = ~00000101 + 1 = 11111011. Phạm vi: -128 đến 127 (8-bit). Chỉ một số 0. Cộng/trừ dùng cùng mạch.",
                excessK: "Excess-K (Biased): Cộng bias (2^(n-1)) vào giá trị. Dùng trong số mũ IEEE 754. Ví dụ: Excess-127 cho float.",
                ieee754: "IEEE 754 Floating-Point: Dấu(1) + Số mũ(8) + Mantissa(23) cho float 32-bit. Ví dụ: -12.5 = 1 10000010 10010000...00",

                twosComplementSteps: "Cách tính Bù 2",
                step1: "Bước 1: Viết số dương sang nhị phân",
                step2: "Bước 2: Đảo tất cả bit (0→1, 1→0)",
                step3: "Bước 3: Cộng 1 vào kết quả",
                step4Example: "Ví dụ: -12 trong 8-bit\n1. 12 = 00001100\n2. Đảo: 11110011\n3. Cộng 1: 11110100 = -12",

                cpuArithmetic: "Cách CPU thực hiện phép toán",
                cpuDesc: "CPU hiện đại dùng mạch phần cứng chuyên biệt cho số học. Hiểu điều này giúp tối ưu code và tránh lỗi.",

                aluDescription: "ALU (Arithmetic Logic Unit): Thành phần chính thực hiện phép toán số học và logic. Chứa adder, subtractor, multiplier, shifter.",
                fullAdder: "Mạch Full Adder: Khối xây dựng cơ bản cho phép cộng. Đầu vào: A, B, Carry-in. Đầu ra: Sum, Carry-out. Công thức: Sum=A⊕B⊕Cin, Cout=(A∧B)∨(Cin∧(A⊕B))",
                carryLookahead: "Carry Look-ahead Adder: Tăng tốc phép cộng bằng tính tất cả carry song song thay vì ripple. Giảm delay từ O(n) xuống O(log n).",
                boothMultiplier: "Thuật toán Booth: Nhân hiệu quả. Giảm partial product bằng mã hóa bit nhân. Ví dụ: 0011→+A, 0111→+2A-A",
                divisionAlgo: "Thuật toán chia: Restoring (chậm, đơn giản), Non-restoring (nhanh), SRT (dùng trong Pentium). Mất 10-40 cycles.",
                floatingPoint: "Floating-Point Unit (FPU): Phần cứng riêng cho IEEE 754. Xử lý normalization, rounding, giá trị đặc biệt (NaN, Infinity). Chậm hơn nhiều so với integer.",

                useCases: "Trường hợp sử dụng phổ biến",
                use1: "Lập trình: Thao tác low-level, xử lý bit, flags, quyền truy cập",
                use2: "Mạng: Địa chỉ IP, subnet mask, phân tích packet",
                use3: "Đồ họa: Xử lý màu (RGB), xử lý ảnh",
                use4: "Mã hóa: Thuật toán mã hóa, hàm hash",
                use5: "Hệ thống nhúng: Xử lý thanh ghi phần cứng, điều khiển I/O",
                use6: "Nén dữ liệu: Huffman coding, run-length encoding",
                use7: "Phát triển game: Phát hiện va chạm, quản lý trạng thái",
                use8: "Cơ sở dữ liệu: Index bitwise, tối ưu lưu flag",

                conversions: "Ví dụ chuyển đổi",
                conv1: "Nhị phân sang Thập phân: 11010₂ = 1×16 + 1×8 + 0×4 + 1×2 + 0×1 = 26₁₀",
                conv2: "Thập phân sang Nhị phân: 26₁₀ = 16 + 8 + 2 = 11010₂",
                conv3: "Hex sang Thập phân: 1A₁₆ = 1×16 + 10 = 26₁₀",
                conv4: "Nhị phân sang Hex: 11010₂ = 1A₁₆ (nhóm 4 bit)",
                conv5: "Octal sang Nhị phân: 32₈ = 011010₂ (3 bit mỗi chữ số)",
                conv6: "Thập phân sang Hex: 255₁₀ = FF₁₆",

                bestPractices: "Best Practices",
                practice1: "Hiểu vị trí bit và lũy thừa 2 để chuyển đổi nhanh trong đầu",
                practice2: "Dùng hex cho biểu diễn nhị phân compact (4 bit mỗi chữ số)",
                practice3: "Nhớ: dịch trái nhân 2, dịch phải chia 2",
                practice4: "Dùng AND để trích xuất bit cụ thể (masking)",
                practice5: "Dùng OR để set bit cụ thể thành 1",
                practice6: "Dùng XOR để toggle bit hoặc mã hóa đơn giản",
                practice7: "Cẩn thận overflow trong phép toán bitwise với số lớn",
                practice8: "Test các trường hợp: 0, giá trị max, số âm",

                performance: "Cân nhắc hiệu suất",
                performanceDesc: "Phép toán bitwise là một trong những phép toán CPU nhanh nhất, thường hoàn thành trong một chu kỳ xung nhịp. Chúng được dùng để tối ưu trong code yêu cầu hiệu suất cao. Dịch bit nhanh hơn nhân/chia với lũy thừa của 2. Xử lý bit có thể giảm bộ nhớ bằng cách đóng gói nhiều boolean flag vào một số nguyên.",

                applications: "Ứng dụng thực tế",
                app1: "Quyền File (Unix): rwxr-xr-x = 755₈ dùng octal cho bit quyền",
                app2: "IP Subnetting: 255.255.255.0 = /24 dùng nhị phân cho network mask",
                app3: "Màu RGB: #FF5733 dùng hex cho giá trị red, green, blue",
                app4: "Bit Flags: enum { READ=1, WRITE=2, EXECUTE=4 } cho phép kết hợp quyền",
                app5: "Tính Checksum: Phép XOR cho phát hiện lỗi",
                app6: "Sinh UUID: Biểu diễn hex của identifier 128-bit",

                tips: "Mẹo nhanh",
                tip1: "Nhị phân: Đếm từ phải, mỗi vị trí gấp đôi (1, 2, 4, 8, 16...)",
                tip2: "Hex: F = 15, A = 10. Mỗi chữ số hex = 4 bit nhị phân",
                tip3: "Octal: Mỗi chữ số = 3 bit nhị phân. Dùng trong quyền file",
                tip4: "Lũy thừa 2: 2⁸=256, 2¹⁰=1024 (1K), 2¹⁶=65536 (64K)",
                tip5: "Nhị phân âm: Bù 2 = đảo bit và cộng 1",
                tip6: "Kiểm tra nhanh: Nếu bit cuối là 1, số lẻ",

                faq: "Câu hỏi thường gặp",
                q1: "Tại sao lập trình viên dùng hexadecimal?",
                a1: "Hexadecimal cung cấp cách compact để biểu diễn dữ liệu nhị phân. Mỗi chữ số hex đại diện chính xác 4 bit nhị phân, giúp đọc và viết dễ hơn chuỗi nhị phân dài. Nó được dùng rộng rãi trong địa chỉ bộ nhớ, mã màu và debug.",

                q2: "Phép toán bitwise hoạt động như thế nào?",
                a2: "Phép toán bitwise hoạt động trên từng bit của số. AND (&) cho ra 1 chỉ khi cả 2 bit là 1. OR (|) cho ra 1 nếu ít nhất 1 bit là 1. XOR (^) cho ra 1 nếu bit khác nhau. NOT (~) đảo tất cả bit. Phép dịch di chuyển bit sang trái hoặc phải.",

                q3: "Sự khác biệt giữa >> và >>> là gì?",
                a3: "Toán tử >> là dịch phải số học giữ nguyên bit dấu (điền bit dấu). Toán tử >>> là dịch phải logic/không dấu luôn điền 0. Điều này quan trọng với số âm trong biểu diễn bù 2.",

                q4: "Làm sao chuyển đổi nhanh giữa nhị phân và hex?",
                a4: "Nhóm các chữ số nhị phân thành nhóm 4 từ phải sang trái. Mỗi nhóm 4 bit bằng một chữ số hex. Ví dụ: 11010110₂ = 1101 0110 = D6₁₆. Điều này hoạt động vì 16 = 2⁴.",

                q5: "Ứng dụng thực tế của XOR là gì?",
                a5: "XOR được dùng để: toggle bit, swap biến không cần biến tạm, mã hóa đơn giản, tính checksum, tìm phần tử duy nhất, và phát hiện khác biệt bit. Đây là phép toán quan trọng trong nhiều thuật toán.",

                q6: "Tại sao octal vẫn được dùng?",
                a6: "Octal chủ yếu dùng trong quyền file Unix/Linux (read=4, write=2, execute=1). Nó cung cấp biểu diễn compact mà mỗi chữ số đại diện 3 bit, tự nhiên cho biểu diễn bộ ba quyền (user, group, others).",

                q7: "Làm sao xử lý số âm trong nhị phân?",
                a7: "Hầu hết hệ thống dùng bù 2: đảo tất cả bit và cộng 1. Ví dụ: -5 trong 8-bit = ~00000101 + 1 = 11111010 + 1 = 11111011. Bit trái nhất chỉ dấu (1=âm).",

                q8: "Giá trị tối đa trong các hệ khác nhau?",
                a8: "Với n bit: Nhị phân max = 2ⁿ-1 (không dấu). 8-bit = 255, 16-bit = 65535, 32-bit = 4294967295. Có dấu dùng 1 bit cho dấu, nên max = 2ⁿ⁻¹-1. Ví dụ: 8-bit có dấu max = 127.",
            },
        },
    },
};
