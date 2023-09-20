import { RedisClientType, createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', err => console.error('Redis Client Error: ', err));

const setRedisData = async (key: string, value: string): Promise<boolean> => {
  try {
    await redisClient.set(key, value);
    console.log('Redis Set Reply: ', 'OK');
    return true;
  } catch (err) {
    console.error('Redis Set Error: ', err);
    return false;
  }
};

const retrieveRedisData = async (key: string): Promise<string | null> => {
  try {
    const reply = await redisClient.get(key);
    if (reply !== null) {
      console.log('Redis retrieval successful');
      console.log(reply)
      return reply;
    } else {
      console.log('Key not found in Redis');
      return null;
    }
  } catch (err) {
    console.error('Redis Get Error: ', err);
    return null;
  }
};

const getAllKeys = async(client: any) => {
  try{
    const keys = await client.keys('*')
    return keys
  }catch(error){
    console.log(error);
    return [];
  }
}

const getAllCache = async(client: any, keys:any) => {
  try{
    let cache:string[] = [];
    for(let key of keys){
      let value = await client.get(key)
      cache.push(value)
    }
    return cache
  }catch(error){
    console.error(error)
  }
}

const clearCache = async (client: any, keys: string[]) => {
  for (let key in keys){
    await client.del(key)
    await client.flushDb()
    await client.dump(key)
  }
  return true;
}

export { setRedisData, retrieveRedisData, redisClient, getAllKeys, getAllCache, clearCache };