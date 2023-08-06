import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import { filteredFeed, generatedFeed } from '../lyrics'

// max 15 chars
export const shortname = 'all-star'

export const handler = async (ctx: AppContext, params: QueryParams) => {
  let cursor = params.cursor ? parseInt(params.cursor) : 0;
  
  let feed = filteredFeed.slice(cursor, cursor + (params.limit ?? 50))
  return {
    cursor: feed.length ? `${cursor + feed.length}` : undefined,
    feed
  }
}
