import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { getFeedCompletion, lyricsCounts, lyricsDict, lyricsRegex, saveDict, savePost } from './lyrics'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'


export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    // This logs the text of every post off the firehose.
    // Just for fun :)
    // Delete before actually using
    // for (const post of ops.posts.creates) {
    //   console.log(post.record.text)
    // }

    // const postsToDelete = ops.posts.deletes.map((del) => del.uri)
  
    for (const create of ops.posts.creates) {
      if (create.record.embed || create.record.reply) {
        continue;
      }
      const regexResult = lyricsRegex.exec(create.record.text);

      if (regexResult !== null) {
          const word = regexResult[1].toLowerCase();
          // console.log(`Found ${word}`);
          console.log(create.record.text);
          const data = {
            uri: create.uri,
            cid: create.cid,
            indexedAt: new Date().toISOString(),
          }
          savePost(word, data);
          console.log(`${getFeedCompletion()}% complete`)
          // console.log("*******************************")
      }
    }
    // const postsToCreate = ops.posts.creates
    //   .filter((create) => {
    //     // only alf-related posts
    //     // return create.record.text.toLowerCase().includes('alf')
    //     return !create.record.embed && !create.record.reply && lyricsRegex.test(create.record.text)
    //   })
    //   .map((create) => {
    //     // map alf-related posts to a db row
    //     return {
    //       uri: create.uri,
    //       cid: create.cid,
    //       replyParent: create.record?.reply?.parent.uri ?? null,
    //       replyRoot: create.record?.reply?.root.uri ?? null,
    //       indexedAt: new Date().toISOString(),
    //     }
    //   })

    // if (postsToDelete.length > 0) {
    //   await this.db
    //     .deleteFrom('post')
    //     .where('uri', 'in', postsToDelete)
    //     .execute()
    // }
    // if (postsToCreate.length > 0) {
    //   await this.db
    //     .insertInto('post')
    //     .values(postsToCreate)
    //     .onConflict((oc) => oc.doNothing())
    //     .execute()
    // }
  }
}
