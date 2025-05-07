import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';
import { Rating } from '../../ratings/entities/ratings.entity';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tmdb_id' }) // Mappt auf Datenbankspalte tmdb_id
  tmdbId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column({ nullable: true })
  poster: string;

  @Column({ nullable: true, type: 'float' })
  imdbRating: number;

  @Column({ nullable: true, type: 'float' })
  rtRating: number | null | undefined; // Explizit null und undefined erlauben

  @OneToMany(() => Watchlist, (watchlist) => watchlist.content)
  watchlist: Watchlist[];

  @OneToMany(() => Rating, (rating) => rating.content)
  ratings: Rating[];
}