// Researched 2026-10-22. Suggested itinerary, not an AI-generated extraction.
export const routeSource = 'https://www.meet-in-shanghai.net/cn/guide/follow-the-route-of-shanghais-first-art-and-cultural-space-alliance-to-be-a-cultural-youth-411800/';
const photo = (file,alt) => ({src:new URL(`./public/assets/shanghai-route/${file}`,import.meta.url).href,alt});
export const shanghaiRoute = {
 title:'虹口半日｜咖啡、看展与老味道',
 body:'这次不只逛展，也要好好喝咖啡、吃一顿。内山纪念书局 → 公啡咖啡馆 → 多伦现代美术馆 → 四新食苑，在四川北路与多伦路一带慢慢走，留出半天。\n咖啡与正餐合计建议预留约100元/人（预算估算，非菜单报价）；停留时长为建议值。出发前确认营业与展期，图片为报道实景。',
 stops:[
  {name:'鲁迅与内山纪念书局',address:'四川北路2050号',cost:'自选',duration:'40分',description:'四川北路2050号，1927·鲁迅与内山纪念书局。把这一站留给阅读与老书店的故事；购书、饮品另计，营业状态以现场为准。',photos:[photo('neishan-1.jpg','1927鲁迅与内山纪念书局实景'),photo('neishan-2.jpg','鲁迅与内山纪念书局内部空间')]},
  {name:'公啡咖啡馆',address:'多伦路251号',cost:'预算40',duration:'45分',description:'多伦路251号。坐下喝杯咖啡，看看石库门与相邻书社。2026年区政府介绍营业时间为9:30—21:00，出发前再确认；饮品按菜单自选。',photos:[photo('gongfei-current.png','公啡咖啡馆，上海虹口2026年报道配图'),photo('gongfei-1.jpg','公啡所在多伦文化艺术空间外观（历史照片）')]},
  {name:'多伦现代美术馆',address:'多伦路27号',cost:'待核实',duration:'50分',description:'多伦路27号。沿街慢走后看一场当代艺术展，再去吃饭。常规周二至周日开放；换展可能闭馆，展期和收费以当期公告为准。',photos:[photo('duolun-1.jpg','上海多伦现代美术馆实景'),photo('duolun-2.jpg','上海多伦现代美术馆历史展览')]},
  {name:'四新食苑',address:'四川北路1908号',cost:'预算60',duration:'50分',description:'四川北路1908号，近多伦路。用炒年糕或菜饭配罗宋汤吃顿正餐，再尝鲜肉、芝麻双味汤圆。预算为预留金额，实际点单与营业以门店为准。',photos:[photo('sixin-2.jpg','四新食苑炒年糕，上观新闻报道配图'),photo('sixin-1.jpg','四新食苑双味汤圆，上观新闻报道配图')]}
 ]
};
