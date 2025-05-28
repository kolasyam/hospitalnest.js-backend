// import { Injectable } from '@nestjs/common';
// import { createClient } from '@supabase/supabase-js';
// // console.log(process.env.SUPABASE_URL);
// @Injectable()
// export class SupabaseService {
//   private client = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_KEY,
//   );

//   getClient() {
//     return this.client;
//   }
// }
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_KEY environment variable',
      );
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
