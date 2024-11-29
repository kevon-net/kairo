const links = {
  navbar: [
    { link: '/', label: 'Home' },
    { link: '/about', label: 'About' },
    { link: '/pricing', label: 'Pricing' },
    {
      link: '/blog',
      label: 'Blog',
    },
    {
      link: '/help',
      label: 'Help',
      subLinks: [{ link: '/help/faq', label: "FAQ's" }],
    },
    {
      link: '/contact',
      label: 'Contact Us',
    },
  ],
};

export default links;
