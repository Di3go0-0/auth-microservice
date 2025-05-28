import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMap } from './links.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMap], 'linksConn'),
  ],
  providers: [LinksService],
  exports: [LinksService]
})
export class LinksModule { }
