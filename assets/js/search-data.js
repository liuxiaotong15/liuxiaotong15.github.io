// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Full list in `google scholar`",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "计算机学院，软件工程系",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-gallery",
          title: "Gallery",
          description: "A photograph is the pause button of life, capturing moments where teamwork becomes friendship.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/gallery/";
          },
        },{id: "dropdown-masters",
              title: "Masters",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/people_master_present/";
              },
            },{id: "dropdown-undergraduates",
              title: "Undergraduates",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/people_ug_present/";
              },
            },{id: "dropdown-masters",
              title: "Masters",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/people_master_alumni/";
              },
            },{id: "dropdown-bachelors",
              title: "Bachelors",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/people_bachelor_alumni/";
              },
            },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather.html";
            },},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "news-a-report-from-bistu-news",
          title: 'A report from BISTU news.',
          description: "",
          section: "News",},{id: "news-a-report-from-prof-siqi-shi",
          title: 'A report from Prof. Siqi Shi',
          description: "",
          section: "News",},{id: "news-a-report-from-ijmmm",
          title: 'A report from IJMMM.',
          description: "",
          section: "News",},{id: "projects-国家科学评论-邀请报告",
          title: '《国家科学评论》邀请报告',
          description: "2025年4月19-20日 湖北 武汉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-团建-马潮渔场-垂钓",
          title: '团建 马潮渔场 垂钓',
          description: "2025年4月22日 昌平",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-2024聚餐合集",
          title: '2024聚餐合集',
          description: "学院路 伊喜饺子",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-journal-of-materials-informatics-编委会",
          title: 'Journal of Materials Informatics 编委会',
          description: "2025年4月26-27日 山西 太原",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-体育竞技-篮球赛-冠军",
          title: '体育竞技 篮球赛 冠军',
          description: "2025年5月6日 北信科沙河",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
