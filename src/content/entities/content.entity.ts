import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';
import { Rating } from '../../ratings/entities/ratings.entity';
@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tmdbId: string;

  @Column()
  type: string;

  @OneToMany(() => Watchlist, (watchlist) => watchlist.content)
  watchlist: Watchlist[];

  @OneToMany(() => Rating, (rating) => rating.content)
  ratings: Rating[];
}