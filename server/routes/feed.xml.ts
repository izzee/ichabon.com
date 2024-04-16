import RSS from 'rss';
import { serverQueryContent } from '#content/server'
export default defineEventHandler(async (event) => {

  const docs = await serverQueryContent(event).sort({ date: -1 }).where({ _partial: false }).find()
  const posts = docs.filter((doc) => doc?._path?.includes('/posts'))

  const feed = new RSS({
    title: 'Isaac Chabon',
    site_url: 'www.ichabon.com',
    feed_url: 'www.ichabon.com/feed.xml',
  });
  for (const post of posts) {
    feed.item({
      title: post.title ?? '-',
      url: `www.ichabon.com/${post._path}`,
      date: post.date,
      description: post.description,
    });
  }
  const feedString = feed.xml({ indent: true });

  event.node.res.setHeader('content-type', 'text/xml');
  event.node.res.end(feedString);

});
