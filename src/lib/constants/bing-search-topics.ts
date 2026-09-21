/**
 * Rich realistic search queries & procedural topics generator for Bing Searches.
 * Provides 1000+ realistic, human-like queries across diverse categories in both Vietnamese and English.
 */

export const VI_TOPICS_POOL = [
    // Công nghệ & Thiết bị
    "cách tăng tốc máy tính windows 11",
    "đánh giá tai nghe chống ồn tốt nhất 2026",
    "so sánh màn hình oled và ips lcd",
    "cách khắc phục wifi chập chờn trên laptop",
    "những tiện ích chrome hữu ích cho công việc",
    "cách bảo vệ tài khoản mạng xã hội không bị hack",
    "top bàn phím cơ gõ êm cho văn phòng",
    "tại sao pin điện thoại tụt nhanh và cách sửa",
    "hướng dẫn cài đặt sao lưu dữ liệu tự động",
    "công nghệ sạc nhanh hoạt động như thế nào",

    // Ẩm thực & Nấu ăn
    "cách làm sườn xào chua ngọt chuẩn vị bắc",
    "công thức nấu phở bò gia truyền thơm ngon",
    "mẹo làm bánh bông lan xốp mềm bằng nồi chiên không dầu",
    "cách ướp thịt nướng bún chả đậm đà",
    "các món canh giải nhiệt mùa hè đơn giản",
    "cách làm nước sốt salad mè rang tại nhà",
    "mẹo bảo quản rau củ tươi lâu trong tủ lạnh",
    "cách pha cà phê muối béo ngậy chuẩn vị huế",
    "thực đơn eat clean giảm cân trong 7 ngày",
    "cách làm sữa hạt hạnh nhân óc chó bổ dưỡng",

    // Sức khỏe & Đời sống
    "uống nước lúc nào trong ngày là tốt nhất",
    "các bài tập giãn cơ giảm đau lưng cho dân văn phòng",
    "cách cải thiện chất lượng giấc ngủ tự nhiên",
    "những thực phẩm giàu vitamin c tăng sức đề kháng",
    "mẹo giảm căng thẳng mệt mỏi sau giờ làm việc",
    "tại sao nên đi bộ 10000 bước mỗi ngày",
    "cách chăm sóc da dầu mụn mùa hè hiệu quả",
    "tập yoga buổi sáng có lợi ích gì",
    "dấu hiệu cơ thể thiếu nước cần bổ sung ngay",
    "cách ngồi làm việc đúng tư thế tránh gù lưng",

    // Du lịch & Khám phá
    "kinh nghiệm du lịch đà lạt tự túc 3 ngày 2 đêm",
    "những quán ăn ngon không thể bỏ qua ở hà nội",
    "địa điểm du lịch biển miền trung đẹp nhất",
    "kinh nghiệm đi phượt hà giang mùa hoa tam giác mạch",
    "các địa điểm check in đẹp nhất tại đà nẵng",
    "cần chuẩn bị gì khi đi cắm trại qua đêm",
    "kinh nghiệm xin visa du lịch nhật bản tự túc",
    "những hòn đảo hoang sơ tuyệt đẹp ở việt nam",
    "thời điểm lý tưởng nhất để du lịch sapa",
    "top khách sạn homestay view đẹp giá rẻ phú quốc",

    // Khoa học & Tự nhiên
    "tại sao bầu trời lại có màu xanh",
    "vũ trụ rộng lớn bao nhiêu và có điểm dừng không",
    "hiện tượng cực quang diễn ra như thế nào",
    "loài vật nào sống lâu nhất trên trái đất",
    "sóng thần hình thành như thế nào ngoài đại dương",
    "tại sao cá voi có thể lặn sâu hàng nghìn mét",
    "hố đen vũ trụ hút mọi thứ như thế nào",
    "nguồn gốc của nước trên trái đất từ đâu",
    "tại sao lá cây lại chuyển màu vào mùa thu",
    "trí tuệ nhân tạo đang thay đổi thế giới ra sao",

    // Điện ảnh & Giải trí
    "những bộ phim khoa học viễn tưởng hay nhất mọi thời đại",
    "tóm tắt cốt truyện phim interstellar",
    "các giải thưởng điện ảnh danh giá nhất thế giới",
    "những bộ phim hoạt hình anime ý nghĩa của ghibli",
    "top bài hát acoustic nhẹ nhàng thư giãn khi làm việc",
    "những cuốn sách phát triển bản thân nên đọc trước tuổi 30",
    "lịch sử ra đời của đàn piano",
    "các tựa game nhập vai thế giới mở hay nhất",
    "những tác phẩm kinh điển của văn học thế giới",
    "cách học chơi đàn guitar căn bản cho người mới",

    // Học tập & Kỹ năng
    "phương pháp ghi nhớ nhanh và lâu pomodoro",
    "cách luyện phát âm tiếng anh chuẩn như người bản xứ",
    "các hàm excel thông dụng nhất trong kế toán văn phòng",
    "cách lập kế hoạch tài chính cá nhân hiệu quả",
    "kỹ năng thuyết trình tự tin trước đám đông",
    "cách quản lý thời gian theo ma trận eisenhower",
    "những website tự học lập trình miễn phí tốt nhất",
    "mẹo đọc sách nhanh mà vẫn nắm chắc nội dung",
    "cách viết email công việc chuyên nghiệp và lịch sự",
    "lợi ích của việc học thêm một ngoại ngữ mới",
];

export const EN_TOPICS_POOL = [
    // Tech & Devices
    "how to speed up windows 11 performance",
    "best noise cancelling headphones review 2026",
    "oled vs ips monitor comparison for productivity",
    "how to troubleshoot unstable wifi on laptop",
    "must have chrome extensions for productivity",
    "how to secure social media accounts with 2fa",
    "best quiet mechanical keyboards for office work",
    "why smartphone battery drains fast and how to fix it",
    "automated backup strategies for personal data",
    "how does fast charging technology actually work",

    // Food & Cooking
    "authentic sweet and sour pork ribs recipe",
    "traditional beef pho broth secret ingredients",
    "how to bake fluffy sponge cake in an air fryer",
    "best marinade for barbecue chicken skewers",
    "easy refreshing summer soup recipes",
    "homemade roasted sesame salad dressing",
    "how to keep fresh vegetables crisp in the fridge",
    "how to make vietnamese salted cream coffee",
    "7-day clean eating meal prep for beginners",
    "homemade almond and walnut milk recipe",

    // Health & Wellness
    "what is the optimal time to drink water daily",
    "daily stretching exercises for office lower back pain",
    "natural ways to improve deep sleep quality",
    "top vitamin c rich foods to boost immune system",
    "effective techniques to de-stress after work",
    "scientific health benefits of 10000 steps a day",
    "simple skincare routine for oily skin in summer",
    "benefits of 15-minute morning yoga routine",
    "early warning signs of dehydration you should know",
    "ergonomic desk posture tips to prevent neck strain",

    // Travel & Adventure
    "3-day travel itinerary for da lat highlands",
    "best street food stalls to visit in hanoi",
    "most picturesque coastal drives in central vietnam",
    "ha giang motorbike loop travel guide and tips",
    "top photography spots around da nang and hoi an",
    "essential checklist for first-time overnight camping",
    "how to apply for a tourist visa to japan",
    "hidden gem islands with pristine beaches",
    "best time of year to visit sapa mountains",
    "budget-friendly scenic homestays in phu quoc",

    // Science & Nature
    "why is the sky blue explained simply",
    "how big is the observable universe",
    "what causes the northern lights aurora borealis",
    "what is the longest living animal on earth",
    "how are ocean tsunamis formed deep underwater",
    "how deep can sperm whales dive without harm",
    "how do supermassive black holes work",
    "where did earth water originally come from",
    "why do deciduous leaves change color in autumn",
    "how artificial intelligence is revolutionizing healthcare",

    // Arts & Entertainment
    "best sci-fi movies of all time ranked",
    "interstellar movie ending explained in detail",
    "history of the oscars academy awards",
    "must watch studio ghibli anime movies",
    "relaxing acoustic instrumental playlist for study",
    "best self-improvement books to read in your 20s",
    "history and evolution of the acoustic piano",
    "top immersive open world rpg video games",
    "timeless classics of modern world literature",
    "beginner guide to learning acoustic guitar chords",

    // Career & Personal Growth
    "pomodoro technique tips for high productivity",
    "how to practice english speaking without a partner",
    "most useful excel formulas for everyday office tasks",
    "how to create a realistic monthly personal budget",
    "overcoming stage fright and public speaking anxiety",
    "how to prioritize tasks using eisenhower matrix",
    "best free websites to learn coding from scratch",
    "speed reading techniques to retain key insights",
    "how to write a clear concise professional email",
    "cognitive benefits of learning a foreign language",
];

// Dynamic combinatorial patterns to generate infinite natural-sounding queries
const VI_PREFIXES = [
    "cách làm",
    "hướng dẫn",
    "mẹo",
    "tìm hiểu về",
    "nguyên nhân",
    "lợi ích của",
    "đánh giá",
    "so sánh",
    "tại sao",
    "những điều cần biết về",
    "kinh nghiệm",
    "top 10",
    "xu hướng mới nhất về",
];

const VI_SUBJECTS = [
    "trí tuệ nhân tạo chatgpt",
    "năng lượng mặt trời gia đình",
    "chế độ ăn giảm mỡ tăng cơ",
    "xe ô tô điện vinfast",
    "kỹ năng giao tiếp ứng xử",
    "đầu tư tài chính cá nhân",
    "cây cảnh phong thủy trong nhà",
    "tập thể dục tại nhà không cần dụng cụ",
    "nấu ăn nhanh cho người bận rộn",
    "du lịch trải nghiệm việt nam",
    "chăm sóc thú cưng chó mèo",
    "học tiếng nhật cho người mới bắt đầu",
    "lập trình web với react và nextjs",
    "chụp ảnh đẹp bằng điện thoại",
    "nghệ thuật sống tối giản",
    "bảo vệ môi trường sống xanh",
    "khám phá các vì sao trong vũ trụ",
    "lịch sử các triều đại việt nam",
    "những kỳ quan thiên nhiên thế giới",
    "cách pha trà thảo mộc thơm ngon",
];

const EN_PREFIXES = [
    "how to",
    "guide to",
    "best tips for",
    "understanding",
    "causes of",
    "benefits of",
    "honest review of",
    "comparison between",
    "why does",
    "everything you need to know about",
    "beginner guide to",
    "top 10",
    "latest trends in",
];

const EN_SUBJECTS = [
    "artificial intelligence in everyday life",
    "residential solar panel installation",
    "high protein meal prep recipes",
    "modern electric vehicle range and battery",
    "interpersonal communication skills at work",
    "personal index fund investing",
    "indoor air purifying house plants",
    "home bodyweight workout routine",
    "quick 15-minute healthy dinners",
    "scenic road trips in southeast asia",
    "puppy training tips for new pet owners",
    "learning conversational spanish fast",
    "modern web development with nextjs",
    "smartphone photography composition tips",
    "minimalist lifestyle habits for clarity",
    "zero waste eco friendly living tips",
    "deep space exploration and telescope discoveries",
    "ancient architectural wonders of the world",
    "brewing specialty loose leaf herbal tea",
    "podcasts about science and technology",
];

/**
 * Generates an array of unique, natural-looking search topics instantly (<1ms).
 * Avoids topics in existingTopics history.
 */
export function generateInstantSearchTopics(
    count: number = 20,
    existingTopics: string[] = [],
    locale: string = "vi"
): string[] {
    const isVi = locale === "vi";
    const basePool = isVi ? [...VI_TOPICS_POOL] : [...EN_TOPICS_POOL];
    const otherPool = isVi ? [...EN_TOPICS_POOL] : [...VI_TOPICS_POOL];
    const prefixes = isVi ? VI_PREFIXES : EN_PREFIXES;
    const subjects = isVi ? VI_SUBJECTS : EN_SUBJECTS;

    const lowerExisting = new Set(existingTopics.map((t) => t.trim().toLowerCase()));
    const result: string[] = [];

    // 1. Shuffle base pool
    const shuffledPool = [...basePool].sort(() => 0.5 - Math.random());

    for (const item of shuffledPool) {
        if (!lowerExisting.has(item.toLowerCase()) && !result.includes(item)) {
            result.push(item);
            if (result.length >= count) return result;
        }
    }

    // 2. Generate combinatorial queries if more are needed
    const shuffledPrefixes = [...prefixes].sort(() => 0.5 - Math.random());
    const shuffledSubjects = [...subjects].sort(() => 0.5 - Math.random());

    for (const p of shuffledPrefixes) {
        for (const s of shuffledSubjects) {
            const query = `${p} ${s}`.trim();
            if (!lowerExisting.has(query.toLowerCase()) && !result.includes(query)) {
                result.push(query);
                if (result.length >= count) return result;
            }
        }
    }

    // 3. Fallback to bilingual mix if still needed
    const shuffledOther = [...otherPool].sort(() => 0.5 - Math.random());
    for (const item of shuffledOther) {
        if (!lowerExisting.has(item.toLowerCase()) && !result.includes(item)) {
            result.push(item);
            if (result.length >= count) return result;
        }
    }

    // 4. In the rare case more are needed, add year/context variants
    let variantIndex = 1;
    while (result.length < count) {
        const base = basePool[variantIndex % basePool.length];
        const extra = `${base} ${2025 + (variantIndex % 3)}`;
        if (!result.includes(extra)) {
            result.push(extra);
        }
        variantIndex++;
    }

    return result.slice(0, count);
}
