"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GpaCalculatorContent() {
    const { locale } = useLanguage();

    if (locale === "vi") {
        return (
            <div className='mt-12 prose prose-lg max-w-none dark:prose-invert'>
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Hệ thống tín chỉ là gì?</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>Hệ thống tín chỉ (Credit System) là phương pháp đào tạo hiện đại được áp dụng rộng rãi tại các trường đại học Việt Nam và trên thế giới. Trong hệ thống này, mỗi môn học được gán một số tín chỉ nhất định tương ứng với khối lượng kiến thức và thời gian học tập.</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Đặc điểm của hệ thống tín chỉ:</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li>
                            <strong>Tín chỉ:</strong> Đơn vị đo lường khối lượng học tập. 1 tín chỉ = 15 tiết lý thuyết hoặc 30-45 tiết thực hành.
                        </li>
                        <li>
                            <strong>Linh hoạt:</strong> Sinh viên có thể tự lựa chọn môn học, thời gian biểu phù hợp với năng lực.
                        </li>
                        <li>
                            <strong>Tích lũy:</strong> Điểm số và tín chỉ được tích lũy qua từng kỳ học để tính GPA tổng.
                        </li>
                        <li>
                            <strong>Chuẩn hóa:</strong> Dễ dàng chuyển đổi giữa các trường, quốc gia theo chuẩn quốc tế.
                        </li>
                    </ul>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Tổng số tín chỉ theo hệ đào tạo:</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li>
                            <strong>Đại học (4 năm):</strong> 120-140 tín chỉ
                        </li>
                        <li>
                            <strong>Cao đẳng (3 năm):</strong> 90-110 tín chỉ
                        </li>
                        <li>
                            <strong>Kỹ sư (5 năm):</strong> 150-180 tín chỉ
                        </li>
                        <li>
                            <strong>Y dược (6 năm):</strong> 180-220 tín chỉ
                        </li>
                    </ul>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>GPA là gì? Cách tính GPA</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>
                        <strong>GPA (Grade Point Average)</strong> - Điểm trung bình tích lũy là chỉ số quan trọng nhất đánh giá kết quả học tập của sinh viên. GPA được tính trên thang điểm 4.0 và phản ánh mức độ tiếp thu kiến thức tổng thể.
                    </p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Công thức tính GPA:</h3>
                    <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-4'>
                        <p className='text-center text-lg font-mono text-gray-900 dark:text-white'>GPA = Σ(Điểm GPA môn học × Số tín chỉ) / Σ(Số tín chỉ)</p>
                    </div>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Ví dụ tính GPA:</h3>
                    <div className='overflow-x-auto mb-4'>
                        <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg'>
                            <thead className='bg-gray-100 dark:bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Môn học</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Điểm (10)</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>GPA (4.0)</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Tín chỉ</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Điểm × TC</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-700 dark:text-gray-300'>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Toán cao cấp</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>8.5</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>4.0</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>12.0</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Vật lý đại cương</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>7.5</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3.0</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>2</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>6.0</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Lập trình C</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>9.0</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>4.0</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>4</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>16.0</td>
                                </tr>
                                <tr className='font-bold bg-blue-50 dark:bg-blue-900/20'>
                                    <td className='px-4 py-3' colSpan={3}>
                                        Tổng
                                    </td>
                                    <td className='px-4 py-3 text-center'>9</td>
                                    <td className='px-4 py-3 text-center'>34.0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className='text-gray-700 dark:text-gray-300'>
                        <strong>Kết quả:</strong> GPA = 34.0 / 9 = <span className='text-blue-600 dark:text-blue-400 font-bold'>3.78</span> (Xếp loại Giỏi)
                    </p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Các hệ thống quy đổi điểm phổ biến</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>Tùy theo từng trường đại học, cách quy đổi từ thang điểm 10 sang thang 4.0 có thể khác nhau. Dưới đây là 3 khung quy đổi phổ biến:</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Khung A - Phổ biến (7 mức điểm)</h3>
                    <p className='text-gray-700 dark:text-gray-300 mb-3'>Được áp dụng tại đa số trường ĐH Quốc gia, ĐH Bách Khoa, FPT University...</p>
                    <div className='overflow-x-auto mb-6'>
                        <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg'>
                            <thead className='bg-gray-100 dark:bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Điểm chữ</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Thang 10</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>GPA (4.0)</th>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Xếp loại</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-700 dark:text-gray-300'>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>A</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>8.5 - 10.0</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>4.0</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Xuất sắc</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>B+</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>8.0 - 8.4</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3.5</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Giỏi</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>B</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>7.0 - 7.9</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3.0</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Khá</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>C+</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>6.5 - 6.9</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>2.5</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Trung bình khá</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>C</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>5.5 - 6.4</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>2.0</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Trung bình</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>D+</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>5.0 - 5.4</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>1.5</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Trung bình yếu</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold'>D</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>4.0 - 4.9</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>1.0</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Yếu</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 font-semibold'>F</td>
                                    <td className='px-4 py-3 text-center'>&lt; 4.0</td>
                                    <td className='px-4 py-3 text-center'>0.0</td>
                                    <td className='px-4 py-3'>Kém</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Khung B - Chi tiết (11 mức điểm)</h3>
                    <p className='text-gray-700 dark:text-gray-300 mb-3'>Phân loại chi tiết hơn, một số trường quốc tế tại VN áp dụng (RMIT, Fulbright...)</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Khung C - Thang 100 (Quốc tế)</h3>
                    <p className='text-gray-700 dark:text-gray-300 mb-3'>Sử dụng tại một số chương trình liên kết quốc tế hoặc trường nước ngoài.</p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Phân loại tốt nghiệp theo GPA</h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg'>
                            <thead className='bg-gray-100 dark:bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Xếp loại</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>GPA (4.0)</th>
                                    <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Điểm (10)</th>
                                    <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Yêu cầu bổ sung</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-700 dark:text-gray-300'>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-yellow-600 dark:text-yellow-400'>Xuất sắc</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>≥ 3.60</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>≥ 9.0</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Không môn dưới 7.0</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-green-600 dark:text-green-400'>Giỏi</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3.20 - 3.59</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>8.0 - 8.9</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Không môn dưới 6.5</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-blue-600 dark:text-blue-400'>Khá</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>2.50 - 3.19</td>
                                    <td className='px-4 py-3 text-center border-b dark:border-gray-700'>7.0 - 7.9</td>
                                    <td className='px-4 py-3 border-b dark:border-gray-700'>Không môn dưới 5.0</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-3 font-semibold text-gray-600 dark:text-gray-400'>Trung bình</td>
                                    <td className='px-4 py-3 text-center'>2.00 - 2.49</td>
                                    <td className='px-4 py-3 text-center'>5.0 - 6.9</td>
                                    <td className='px-4 py-3'>Đạt tín chỉ tối thiểu</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-3'>
                        <em>Lưu ý: Yêu cầu cụ thể có thể khác nhau tùy từng trường. Một số trường còn yêu cầu thêm điều kiện về TOEIC, luận văn, nghiên cứu khoa học...</em>
                    </p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Câu hỏi thường gặp (FAQ)</h2>

                    <div className='space-y-6'>
                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>1. GPA 3.0 được xếp loại gì?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>
                                GPA 3.0 tương đương xếp loại <strong>Khá</strong>. Đây là mức điểm tốt, đủ điều kiện xét học bổng và được nhiều nhà tuyển dụng đánh giá cao.
                            </p>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>2. GPA tối thiểu để tốt nghiệp là bao nhiêu?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>
                                Hầu hết các trường yêu cầu GPA tối thiểu là <strong>2.0/4.0</strong> (tương đương 5.0/10) để được xét tốt nghiệp. Tuy nhiên, bạn nên kiểm tra quy định cụ thể của trường mình.
                            </p>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>3. Làm sao để biết trường mình dùng khung quy đổi nào?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>Kiểm tra quy chế đào tạo hoặc bảng điểm trên cổng thông tin sinh viên. Nếu không rõ, hãy liên hệ phòng Đào tạo của trường để được tư vấn chính xác.</p>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>4. GPA học kỳ và GPA tích lũy khác nhau như thế nào?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>
                                <strong>GPA học kỳ:</strong> Chỉ tính điểm các môn trong kỳ đó.
                                <br />
                                <strong>GPA tích lũy:</strong> Tính tổng hợp tất cả các môn từ đầu khóa học đến hiện tại.
                            </p>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>5. Học lại môn có ảnh hưởng đến GPA không?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>Có. Cách tính phụ thuộc vào quy định của trường: một số trường chỉ tính điểm cao nhất, một số tính trung bình các lần học, một số chỉ tính lần học cuối.</p>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>6. GPA bao nhiêu thì được học bổng?</h3>
                            <p className='text-gray-700 dark:text-gray-300'>Tùy từng trường và loại học bổng:</p>
                            <ul className='list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300'>
                                <li>Học bổng khuyến khích học tập: GPA ≥ 3.2</li>
                                <li>Học bổng toàn phần: GPA ≥ 3.6 - 3.8</li>
                                <li>Học bổng doanh nghiệp: GPA ≥ 3.0 + kỹ năng mềm</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Tips nâng cao GPA</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>📚 Tập trung vào môn tín chỉ cao</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>Các môn 4-5 tín chỉ ảnh hưởng nhiều hơn đến GPA. Ưu tiên học tốt những môn này.</p>
                        </div>
                        <div className='bg-green-50 dark:bg-green-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>🎯 Duy trì ổn định</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>GPA cao hơn 3.2 từ năm nhất giúp bạn có nền tảng vững để phát triển.</p>
                        </div>
                        <div className='bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>💡 Học lại nếu cần</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>Đừng ngại học lại môn điểm thấp, đặc biệt nếu trường tính điểm cao nhất.</p>
                        </div>
                        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>⚖️ Cân bằng môn học</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>Đừng đăng ký quá nhiều môn khó trong cùng một kỳ.</p>
                        </div>
                    </div>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Hướng dẫn Import dữ liệu từ Excel</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>Bạn có thể import danh sách môn học từ file Excel hoặc CSV để tiết kiệm thời gian nhập liệu.</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Cách chuẩn bị file:</h3>
                    <ol className='list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                        <li>Tạo file Excel (.xlsx) hoặc CSV (.csv)</li>
                        <li>
                            Dòng đầu tiên là tiêu đề: <code>Tên môn học, Điểm, Tín chỉ</code>
                        </li>
                        <li>Các dòng tiếp theo là dữ liệu môn học</li>
                    </ol>

                    <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4'>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Ví dụ file CSV:</p>
                        <pre className='text-sm text-gray-800 dark:text-gray-300 overflow-x-auto'>
                            {`Tên môn học,Điểm,Tín chỉ
Toán cao cấp 1,8.5,3
Vật lý đại cương,7.0,4
Lập trình C,9.0,4
Tiếng Anh 1,8.0,3`}
                        </pre>
                    </div>

                    <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                            <strong>💡 Lưu ý:</strong> File có thể phân tách bằng dấu phẩy (,) hoặc tab. Hệ thống sẽ tự động phát hiện và xử lý.
                        </p>
                    </div>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Quy tắc validation:</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li>
                            <strong>Tên môn học:</strong> Không được để trống
                        </li>
                        <li>
                            <strong>Điểm:</strong> Từ 0 đến 10 (chấp nhận số thập phân)
                        </li>
                        <li>
                            <strong>Tín chỉ:</strong> Từ 1 đến 20 (số nguyên)
                        </li>
                        <li>
                            <strong>Kích thước file:</strong> Tối đa 1MB
                        </li>
                        <li>
                            <strong>Định dạng:</strong> .csv hoặc .txt
                        </li>
                    </ul>

                    <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg mt-4'>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                            <strong>⚠️ Chú ý:</strong> Các dòng có dữ liệu không hợp lệ sẽ tự động bị bỏ qua và hệ thống sẽ thông báo số dòng bị lỗi.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    // English version
    return (
        <div className='mt-12 prose prose-lg max-w-none dark:prose-invert'>
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>What is the Credit System?</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>The Credit System is a modern educational method widely applied in Vietnamese universities and worldwide. In this system, each course is assigned a certain number of credits corresponding to the knowledge volume and study time.</p>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Credit System Features:</h3>
                <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                    <li>
                        <strong>Credit:</strong> Unit of learning measurement. 1 credit = 15 theory periods or 30-45 practice periods.
                    </li>
                    <li>
                        <strong>Flexibility:</strong> Students can choose courses and schedules suitable to their abilities.
                    </li>
                    <li>
                        <strong>Accumulation:</strong> Grades and credits are accumulated over semesters to calculate cumulative GPA.
                    </li>
                    <li>
                        <strong>Standardization:</strong> Easy transfer between schools and countries according to international standards.
                    </li>
                </ul>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Total Credits by Program:</h3>
                <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                    <li>
                        <strong>Bachelor (4 years):</strong> 120-140 credits
                    </li>
                    <li>
                        <strong>College (3 years):</strong> 90-110 credits
                    </li>
                    <li>
                        <strong>Engineering (5 years):</strong> 150-180 credits
                    </li>
                    <li>
                        <strong>Medical (6 years):</strong> 180-220 credits
                    </li>
                </ul>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>What is GPA? How to Calculate GPA</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    <strong>GPA (Grade Point Average)</strong> is the most important indicator evaluating student academic performance. GPA is calculated on a 4.0 scale and reflects overall knowledge acquisition.
                </p>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>GPA Formula:</h3>
                <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-4'>
                    <p className='text-center text-lg font-mono text-gray-900 dark:text-white'>GPA = Σ(Course GPA × Credits) / Σ(Credits)</p>
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Graduation Classification by GPA</h2>
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg'>
                        <thead className='bg-gray-100 dark:bg-gray-700'>
                            <tr>
                                <th className='px-4 py-3 text-left text-gray-900 dark:text-white border-b dark:border-gray-600'>Classification</th>
                                <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>GPA (4.0)</th>
                                <th className='px-4 py-3 text-center text-gray-900 dark:text-white border-b dark:border-gray-600'>Grade (10)</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 dark:text-gray-300'>
                            <tr>
                                <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-yellow-600 dark:text-yellow-400'>Excellent</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>≥ 3.60</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>≥ 9.0</td>
                            </tr>
                            <tr>
                                <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-green-600 dark:text-green-400'>Good</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>3.20 - 3.59</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>8.0 - 8.9</td>
                            </tr>
                            <tr>
                                <td className='px-4 py-3 border-b dark:border-gray-700 font-semibold text-blue-600 dark:text-blue-400'>Fair</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>2.50 - 3.19</td>
                                <td className='px-4 py-3 text-center border-b dark:border-gray-700'>7.0 - 7.9</td>
                            </tr>
                            <tr>
                                <td className='px-4 py-3 font-semibold text-gray-600 dark:text-gray-400'>Average</td>
                                <td className='px-4 py-3 text-center'>2.00 - 2.49</td>
                                <td className='px-4 py-3 text-center'>5.0 - 6.9</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Frequently Asked Questions (FAQ)</h2>

                <div className='space-y-6'>
                    <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>1. What classification is GPA 3.0?</h3>
                        <p className='text-gray-700 dark:text-gray-300'>
                            GPA 3.0 is classified as <strong>Fair</strong>. This is a good score, qualifying for scholarships and highly valued by employers.
                        </p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>2. What is the minimum GPA to graduate?</h3>
                        <p className='text-gray-700 dark:text-gray-300'>
                            Most universities require a minimum GPA of <strong>2.0/4.0</strong> (equivalent to 5.0/10) for graduation consideration.
                        </p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-lg'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>3. What GPA is needed for scholarships?</h3>
                        <p className='text-gray-700 dark:text-gray-300'>Depends on the university and scholarship type:</p>
                        <ul className='list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300'>
                            <li>Academic encouragement: GPA ≥ 3.2</li>
                            <li>Full scholarship: GPA ≥ 3.6 - 3.8</li>
                            <li>Corporate scholarship: GPA ≥ 3.0 + soft skills</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Excel Import Guide</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>You can import your course list from an Excel or CSV file to save time on data entry.</p>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>How to prepare your file:</h3>
                <ol className='list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                    <li>Create an Excel (.xlsx) or CSV (.csv) file</li>
                    <li>
                        First row is the header: <code>Course Name, Grade, Credits</code>
                    </li>
                    <li>Following rows contain course data</li>
                </ol>

                <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4'>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Example CSV file:</p>
                    <pre className='text-sm text-gray-800 dark:text-gray-300 overflow-x-auto'>
                        {`Course Name,Grade,Credits
Calculus 1,8.5,3
Physics,7.0,4
Programming C,9.0,4
English 1,8.0,3`}
                    </pre>
                </div>

                <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                        <strong>💡 Note:</strong> Files can be delimited by comma (,) or tab. The system will automatically detect and process.
                    </p>
                </div>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Validation Rules:</h3>
                <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                    <li>
                        <strong>Course Name:</strong> Cannot be empty
                    </li>
                    <li>
                        <strong>Grade:</strong> Between 0 and 10 (decimal allowed)
                    </li>
                    <li>
                        <strong>Credits:</strong> Between 1 and 20 (integer)
                    </li>
                    <li>
                        <strong>File Size:</strong> Maximum 1MB
                    </li>
                    <li>
                        <strong>Format:</strong> .csv or .txt
                    </li>
                </ul>

                <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg mt-4'>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                        <strong>⚠️ Warning:</strong> Rows with invalid data will be automatically skipped and the system will notify you of the error count.
                    </p>
                </div>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Grade Conversion Tool - Scale Converter</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>The grade converter tool helps you easily convert between the 10-point scale (common in Vietnam) and the 4.0 GPA scale (international standard).</p>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Why do you need grade conversion?</h3>
                <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                    <li>
                        <strong>Study Abroad:</strong> Most international universities require GPA on a 4.0 scale
                    </li>
                    <li>
                        <strong>Scholarships:</strong> Many scholarship programs use the 4.0 GPA scale for evaluation
                    </li>
                    <li>
                        <strong>Recruitment:</strong> Multinational companies often require GPA instead of 10-point grades
                    </li>
                    <li>
                        <strong>Comparison:</strong> Easy to compare academic results with international students
                    </li>
                </ul>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>Important notes for conversion:</h3>
                <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4'>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li>Conversion results may vary depending on each university's grading system</li>
                        <li>Some schools may require official grade conversion certification from the Registrar's Office</li>
                        <li>GPA 4.0 is the maximum value, equivalent to 8.5-10 on the 10-point scale</li>
                        <li>Choose the correct conversion system that your school uses</li>
                    </ul>
                </div>

                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>How to use the conversion tool:</h3>
                <ol className='list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                    <li>Select the grading system that matches your school</li>
                    <li>
                        <strong>Convert from 10 to 4.0:</strong> Enter your grade (e.g., 8.5) in the left box
                    </li>
                    <li>
                        <strong>Convert from 4.0 to 10:</strong> Enter GPA (e.g., 3.5) in the right box
                    </li>
                    <li>Results will display instantly with letter grade and classification</li>
                    <li>Refer to the quick reference table below to see the complete conversion scale</li>
                </ol>

                <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                        <strong>💡 Tip:</strong> Use this tool to check your GPA before submitting study abroad or scholarship applications. This helps you accurately assess your chances of acceptance.
                    </p>
                </div>
            </section>
        </div>
    );
}
