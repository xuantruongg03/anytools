export const gpaCalculatorTranslations = {
    en: {
        gpaCalculator: {
            name: "GPA Calculator",
            description: "Calculate grade point average and predict target GPA",
            page: {
                title: "GPA Calculator - Grade Point Average & Credit System",
                subtitle: "Calculate GPA, predict target grades, and simulate academic results",

                // Credit System Section
                creditSystemTitle: "What is the Credit System?",
                creditSystemDesc: "The Credit System is a modern educational method widely adopted in universities in Vietnam and around the world. In this system, each course is assigned a certain number of credits corresponding to the knowledge volume and study time.",
                creditSystemFeaturesTitle: "Features of the Credit System:",
                creditSystemFeatures: {
                    credit: "<strong>Credit:</strong> A unit measuring study volume. 1 credit = 15 theory periods or 30-45 practice periods.",
                    flexibility: "<strong>Flexibility:</strong> Students can choose courses and schedules according to their abilities.",
                    independence: "<strong>Independence:</strong> Encourages self-study and research spirit.",
                    evaluation: "<strong>Evaluation:</strong> More objective and transparent through GPA (Grade Point Average).",
                },

                // GPA Section
                gpaTitle: "What is GPA?",
                gpaDesc: "GPA (Grade Point Average) is a comprehensive indicator reflecting students' learning achievement. GPA is calculated based on the grades and number of credits of each course.",
                gpaTypesTitle: "Types of GPA:",
                gpaTypes: {
                    term: "<strong>Term GPA:</strong> Average score of one semester.",
                    cumulative: "<strong>Cumulative GPA:</strong> Average score of all studied semesters.",
                    major: "<strong>Major GPA:</strong> Average score of major courses only.",
                },

                // Calculation Formula
                formulaTitle: "GPA Calculation Formula",
                formulaDesc: "GPA is calculated by the following formula:",
                formulaSteps: {
                    step1: "Multiply the grade of each course by its credits",
                    step2: "Sum all products from step 1",
                    step3: "Divide by the total number of credits",
                },
                formulaNote: "<strong>Note:</strong> Grades are converted to a 4.0 scale according to each school's regulations. Most schools use the conversion table: A (8.5-10) = 4.0, B (7.0-8.4) = 3.0, C (5.5-6.9) = 2.0, D (4.0-5.4) = 1.0, F (<4.0) = 0.",

                // GPA Classification
                classificationTitle: "GPA Classification",
                classificationDesc: "Most universities in Vietnam classify academic achievement based on the 4.0 scale as follows:",
                classifications: {
                    excellent: "<strong>Excellent:</strong> GPA ≥ 3.60",
                    good: "<strong>Good:</strong> 3.20 ≤ GPA < 3.60",
                    fair: "<strong>Fair:</strong> 2.50 ≤ GPA < 3.20",
                    average: "<strong>Average:</strong> 2.00 ≤ GPA < 2.50",
                    weak: "<strong>Weak:</strong> GPA < 2.00",
                },
                classificationNote: "<strong>Note:</strong> Some schools may have different classification criteria. Please refer to your school's regulations for accuracy.",

                // Why Important
                importanceTitle: "Why is GPA Important?",
                importanceItems: {
                    scholarship: "<strong>Scholarships:</strong> Most scholarships require minimum GPA (usually ≥ 3.2)",
                    graduation: "<strong>Graduation:</strong> GPA ≥ 2.0 is a minimum requirement for graduation",
                    studyAbroad: "<strong>Study Abroad:</strong> Universities abroad prioritize students with high GPA",
                    employment: "<strong>Employment:</strong> Many companies require minimum GPA in recruitment",
                    competition: "<strong>Academic Competitions:</strong> GPA is a selection criterion for academic programs",
                },

                // Tips
                tipsTitle: "Tips to Improve GPA",
                tips: {
                    highCredit: {
                        title: "📚 Focus on High-Credit Courses",
                        desc: "4-5 credit courses have more impact on GPA. Prioritize studying these courses well.",
                    },
                    maintain: {
                        title: "🎯 Maintain Stability",
                        desc: "GPA above 3.2 from freshman year helps you have a solid foundation for development.",
                    },
                    retake: {
                        title: "💡 Retake if Needed",
                        desc: "Don't hesitate to retake low-grade courses, especially if your school counts the highest grade.",
                    },
                    balance: {
                        title: "⚖️ Balance Courses",
                        desc: "Don't register for too many difficult courses in the same semester.",
                    },
                },

                // Import Guide
                importTitle: "Guide to Import Data from Excel",
                importDesc: "You can import course lists from Excel or CSV files to save data entry time.",
                importStepsTitle: "How to prepare the file:",
                importSteps: {
                    step1: "Create an Excel (.xlsx) or CSV (.csv) file",
                    step2: "The first row is the header: <code>Course Name, Grade, Credit</code>",
                    step3: "The following rows are course data",
                },
                importExampleTitle: "Example CSV file:",
                importExample: `Course Name,Grade,Credit
Calculus 1,8.5,3
General Physics,7.0,4
C Programming,9.0,4
English 1,8.0,3`,
                importRequirementsTitle: "Requirements:",
                importRequirements: {
                    grade: "<strong>Grade:</strong> From 0 to 10 (can be decimal)",
                    credit: "<strong>Credit:</strong> From 1 to 20 (integer)",
                    fileSize: "<strong>File size:</strong> Maximum 1MB",
                    format: "<strong>Format:</strong> .csv or .txt",
                },
                importWarning: "<strong>⚠️ Note:</strong> Rows with invalid data will be automatically skipped and the system will notify the number of error rows.",

                // Conclusion
                conclusionTitle: "Conclusion",
                conclusionDesc: "GPA is not just a number, but a reflection of your learning effort and attitude. Use this calculator regularly to monitor your learning progress and plan to achieve your academic goals!",
                conclusionTip: "<strong>💡 Tip:</strong> Use this tool to check your GPA before submitting study abroad or scholarship applications. This helps you accurately assess your chances of acceptance.",
            },
        },
    },
    vi: {
        gpaCalculator: {
            name: "Máy tính GPA",
            description: "Tính điểm trung bình tích lũy và dự đoán GPA mục tiêu",
            page: {
                title: "Máy tính GPA - Điểm trung bình tích lũy",
                subtitle: "Tính GPA, dự đoán điểm cần thiết, và mô phỏng kết quả học tập",

                // Credit System Section
                creditSystemTitle: "Hệ thống tín chỉ là gì?",
                creditSystemDesc: "Hệ thống tín chỉ (Credit System) là phương pháp đào tạo hiện đại được áp dụng rộng rãi tại các trường đại học Việt Nam và trên thế giới. Trong hệ thống này, mỗi môn học được gán một số tín chỉ nhất định tương ứng với khối lượng kiến thức và thời gian học tập.",
                creditSystemFeaturesTitle: "Đặc điểm của hệ thống tín chỉ:",
                creditSystemFeatures: {
                    credit: "<strong>Tín chỉ:</strong> Đơn vị đo lường khối lượng học tập. 1 tín chỉ = 15 tiết lý thuyết hoặc 30-45 tiết thực hành.",
                    flexibility: "<strong>Linh hoạt:</strong> Sinh viên có thể tự lựa chọn môn học, thời gian biểu phù hợp với năng lực.",
                    independence: "<strong>Tự chủ:</strong> Khuyến khích tinh thần tự học và nghiên cứu.",
                    evaluation: "<strong>Đánh giá:</strong> Khách quan và minh bạch hơn thông qua GPA (Grade Point Average).",
                },

                // GPA Section
                gpaTitle: "GPA là gì?",
                gpaDesc: "GPA (Grade Point Average) là chỉ số tổng hợp phản ánh kết quả học tập của sinh viên. GPA được tính dựa trên điểm số và số tín chỉ của từng môn học.",
                gpaTypesTitle: "Các loại GPA:",
                gpaTypes: {
                    term: "<strong>GPA học kỳ:</strong> Điểm trung bình của một học kỳ.",
                    cumulative: "<strong>GPA tích lũy:</strong> Điểm trung bình của tất cả các học kỳ đã học.",
                    major: "<strong>GPA chuyên ngành:</strong> Điểm trung bình chỉ tính các môn thuộc chuyên ngành.",
                },

                // Calculation Formula
                formulaTitle: "Công thức tính GPA",
                formulaDesc: "GPA được tính theo công thức sau:",
                formulaSteps: {
                    step1: "Nhân điểm của mỗi môn với số tín chỉ tương ứng",
                    step2: "Cộng tất cả các tích vừa tính được",
                    step3: "Chia cho tổng số tín chỉ",
                },
                formulaNote: "<strong>Lưu ý:</strong> Điểm số được quy đổi sang thang điểm 4.0 theo quy định của từng trường. Đa số trường áp dụng bảng quy đổi: A (8.5-10) = 4.0, B (7.0-8.4) = 3.0, C (5.5-6.9) = 2.0, D (4.0-5.4) = 1.0, F (<4.0) = 0.",

                // GPA Classification
                classificationTitle: "Xếp loại học tập theo GPA",
                classificationDesc: "Hầu hết các trường đại học ở Việt Nam xếp loại học lực dựa trên thang điểm 4.0 như sau:",
                classifications: {
                    excellent: "<strong>Xuất sắc:</strong> GPA ≥ 3.60",
                    good: "<strong>Giỏi:</strong> 3.20 ≤ GPA < 3.60",
                    fair: "<strong>Khá:</strong> 2.50 ≤ GPA < 3.20",
                    average: "<strong>Trung bình:</strong> 2.00 ≤ GPA < 2.50",
                    weak: "<strong>Yếu:</strong> GPA < 2.00",
                },
                classificationNote: "<strong>Lưu ý:</strong> Một số trường có thể có tiêu chí xếp loại khác nhau. Vui lòng tham khảo quy chế của trường bạn để biết chính xác.",

                // Why Important
                importanceTitle: "Tại sao GPA quan trọng?",
                importanceItems: {
                    scholarship: "<strong>Học bổng:</strong> Hầu hết học bổng yêu cầu GPA tối thiểu (thường ≥ 3.2)",
                    graduation: "<strong>Tốt nghiệp:</strong> GPA ≥ 2.0 là điều kiện tối thiểu để được tốt nghiệp",
                    studyAbroad: "<strong>Du học:</strong> Các trường đại học nước ngoài ưu tiên sinh viên có GPA cao",
                    employment: "<strong>Xin việc:</strong> Nhiều công ty yêu cầu GPA tối thiểu khi tuyển dụng",
                    competition: "<strong>Thi học sinh giỏi:</strong> GPA là tiêu chí lọc vào các chương trình học thuật",
                },

                // Tips
                tipsTitle: "Tips nâng cao GPA",
                tips: {
                    highCredit: {
                        title: "📚 Tập trung vào môn tín chỉ cao",
                        desc: "Các môn 4-5 tín chỉ ảnh hưởng nhiều hơn đến GPA. Ưu tiên học tốt những môn này.",
                    },
                    maintain: {
                        title: "🎯 Duy trì ổn định",
                        desc: "GPA cao hơn 3.2 từ năm nhất giúp bạn có nền tảng vững để phát triển.",
                    },
                    retake: {
                        title: "💡 Học lại nếu cần",
                        desc: "Đừng ngại học lại môn điểm thấp, đặc biệt nếu trường tính điểm cao nhất.",
                    },
                    balance: {
                        title: "⚖️ Cân bằng môn học",
                        desc: "Đừng đăng ký quá nhiều môn khó trong cùng một kỳ.",
                    },
                },

                // Import Guide
                importTitle: "Hướng dẫn Import dữ liệu từ Excel",
                importDesc: "Bạn có thể import danh sách môn học từ file Excel hoặc CSV để tiết kiệm thời gian nhập liệu.",
                importStepsTitle: "Cách chuẩn bị file:",
                importSteps: {
                    step1: "Tạo file Excel (.xlsx) hoặc CSV (.csv)",
                    step2: "Dòng đầu tiên là tiêu đề: <code>Tên môn học, Điểm, Tín chỉ</code>",
                    step3: "Các dòng tiếp theo là dữ liệu môn học",
                },
                importExampleTitle: "Ví dụ file CSV:",
                importExample: `Tên môn học,Điểm,Tín chỉ
Toán cao cấp 1,8.5,3
Vật lý đại cương,7.0,4
Lập trình C,9.0,4
Tiếng Anh 1,8.0,3`,
                importRequirementsTitle: "Yêu cầu:",
                importRequirements: {
                    grade: "<strong>Điểm:</strong> Từ 0 đến 10 (có thể là số thập phân)",
                    credit: "<strong>Tín chỉ:</strong> Từ 1 đến 20 (số nguyên)",
                    fileSize: "<strong>Kích thước file:</strong> Tối đa 1MB",
                    format: "<strong>Định dạng:</strong> .csv hoặc .txt",
                },
                importWarning: "<strong>⚠️ Chú ý:</strong> Các dòng có dữ liệu không hợp lệ sẽ tự động bị bỏ qua và hệ thống sẽ thông báo số dòng bị lỗi.",

                // Conclusion
                conclusionTitle: "Kết luận",
                conclusionDesc: "GPA không chỉ là một con số, mà là sự phản ánh nỗ lực học tập và thái độ của bạn. Hãy sử dụng công cụ tính toán này thường xuyên để theo dõi tiến độ học tập và lập kế hoạch đạt được mục tiêu học thuật của mình!",
                conclusionTip: "<strong>💡 Tip:</strong> Sử dụng công cụ này để kiểm tra GPA của bạn trước khi nộp hồ sơ du học hoặc xin học bổng. Điều này giúp bạn định hướng chính xác hơn về cơ hội trúng tuyển.",
            },
        },
    },
};
