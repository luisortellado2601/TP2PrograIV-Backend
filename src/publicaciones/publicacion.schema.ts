import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema()
export class Publicacion {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop()
  imagenUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ default: Date.now })
  fecha: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Usuario', default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: false })
  eliminada: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
