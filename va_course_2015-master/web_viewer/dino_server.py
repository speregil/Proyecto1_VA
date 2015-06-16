import tornado.ioloop
import tornado.web
import os
import pandas as pd
import numpy as np
import json

data = pd.DataFrame(columns=('X', 'Y', 'count'))

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("dino_map.html")

class DinoFilter(tornado.web.RequestHandler):
    def get(self):
        self.render("dino_filter.html")

class FilterData(tornado.web.RequestHandler):
    def get(self):
        x_min = float(self.get_argument("x_min"))
        x_max = float(self.get_argument("x_max"))
        y_min = float(self.get_argument("y_min"))
        y_max = float(self.get_argument("y_max"))
        t_min = np.datetime64(int(self.get_argument("t_min")),"ms")
        t_max = np.datetime64(int(self.get_argument("t_max")),"ms")

        df = self.df
        area = (df["X"]<=x_max) & (df["X"]>=x_min) & (df["Y"]<=y_max) & (df["Y"]>=y_min)
        time = (df["time"] >= t_min) & (df["time"] <= t_max)
        # as int
        guests = sorted(df.loc[area & time,"id"].unique().tolist())
        self.write({"guests" : guests})

    def initialize(self, df):
        self.df = df


class DataHandler(tornado.web.RequestHandler):
    def get(self):
        df = self.df
        guest_id = self.get_argument("id", None)
        if guest_id is None:
            guest_id = np.random.choice(df["id"])
        else:
            guest_id = int(guest_id)
        #guest_df = df.loc[df["id"]==guest_id]
        #guest_df_list = guest_df.to_dict("records")        
        #self.write({"array" :guest_df_list})
        
        """
        df_checks_positions = df.loc[df["type"]=="check-in"].drop_duplicates(['X', 'Y']).ix[:,'X':]
        df_checks_list = df_checks_positions.to_dict("records")
        self.write({"array" :df_checks_list})
        """
        """
        i = 0
        data_list = []
        df_checks_positions = df.loc[df["type"]=="check-in"].drop_duplicates(['X', 'Y']).ix[:,'X':]
        while i < df_checks_positions.shape[0]:
            df_checks_countA = df.loc[df["X"]==df_checks_positions['X'].iloc[i]]
            df_checks_countB =  df_checks_countA.loc[df_checks_countA["Y"]==df_checks_positions['Y'].iloc[i]]
            x = df_checks_countB['X'].iloc[0]
            y = df_checks_countB['Y'].iloc[0]
            density = df_checks_countB.count(axis=0).iloc[3]
            data_dict = {'X': x, 'Y': y, 'density': density}
            data_list.append(data_dict)
            i+=1
        df_density = pd.DataFrame.from_dict(data_list)
        self.write({"array" :df_density})
        """
        data = pd.DataFrame(columns=('X', 'Y', 'count'))
        cuenta(63,99, '', '', '')
        cuenta(0,67, '', '', '')
        cuenta(99,77, '', '', '')
        cuenta(73,84, '', '', '')
        cuenta(76,88, '', '', '')
        cuenta(17,43, '', '', '')
        cuenta(6,43, '', '', '')
        cuenta(38,90, '', '', '')
        cuenta(73,79, '', '', '')
        cuenta(27,15, '', '', '')
        cuenta(43,78, '', '', '')
        cuenta(87,81, '', '', '')
        cuenta(79,89, '', '', '')
        cuenta(32,33, '', '', '')
        cuenta(34,68, '', '', '')
        cuenta(83,88, '', '', '')
        cuenta(86,44, '', '', '')
        cuenta(16,49, '', '', '')
        cuenta(79,87, '', '', '')
        cuenta(60,37, '', '', '')
        cuenta(48,87, '', '', '')
        cuenta(43,56, '', '', '')
        cuenta(85,86, '', '', '')
        cuenta(87,63, '', '', '')
        cuenta(17,67, '', '', '')
        cuenta(92,81, '', '', '')
        cuenta(45,24, '', '', '')
        cuenta(69,44, '', '', '')
        cuenta(78,48, '', '', '')
        cuenta(87,48, '', '', '')
        cuenta(82,80, '', '', '')
        cuenta(47,11, '', '', '')
        cuenta(67,37, '', '', '')
        cuenta(16,66, '', '', '')
        cuenta(23,54, '', '', '')
        cuenta(42,37, '', '', '')
        cuenta(28,66, '', '', '')
        cuenta(78,37, '', '', '')
        cuenta(81,77, '', '', '')
        cuenta(26,59, '', '', '')
        cuenta(50,57, '', '', '')
        cuenta(76,22, '', '', '')
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})

    def initialize(self, df):
        self.df = df[["X","Y","id","Timestamp","type"]]
       
class ConteoHandler(tornado.web.RequestHandler):
    def get(self):    
        df = self.df
        pos_x = int(self.get_argument("x"))
        pos_y = float(self.get_argument("y"))
        dia = self.get_argument("dia")
        hora = self.get_argument("hora")
        tipo = self.get_argument("tipo")
        
        cuenta(pos_x,pos_y,dia,hora,tipo, df)
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})
    
    def initialize(self, df):
        self.df = df
        
class VisitasHandler(tornado.web.RequestHandler):
    def get(self):    
        df = self.df
        dia = self.get_argument("dia")
        hora = self.get_argument("hora")
        tipo = self.get_argument("tipo")
        
        cuenta_visitas(dia,hora,tipo, df)
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})
    
    def initialize(self, df):
        self.df = df

class PromedioHandler(tornado.web.RequestHandler):
    def get(self):    
        df = self.df
        promedio_visitas(df)
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})
    
    def initialize(self, df):
        self.df = df
        
class DuracionHandler(tornado.web.RequestHandler):
    def get(self):    
        df = self.df
        dia = self.get_argument("dia")
        cuenta_duracion_dia(dia, df)
        df_checks_list = data.to_dict("records")
        self.write({"array" :df_checks_list})
    
    def initialize(self, df):
        self.df = df

def cuenta(x, y, dia, hora, tipo, df):
    if(tipo == 'Global'):
        return cuenta_global(x, y, df)
    elif(tipo == 'Dia'):
        return cuenta_dia(x, y, dia)
    else:
        return cuenta_medio_dia(x, y, dia, hora)
        
def cuenta_global(x, y, df):
    cuenta = df['X'].loc[(df['X'] == x) & (df['Y'] == y) & (df["type"]=="check-in")].count()
    data.loc[len(data)+1]=[x, y,cuenta]
    
def cuenta_dia(x, y, dia):
    fecha = ''
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
    cuenta = df['X'].loc[(df['X'] == x) & (df['Y'] == y) & (df["type"]=="check-in") & (df['time'] >= fecha + ' 00:00:00') & (df['time'] <= fecha + ' 23:00:00')].count()
    data.loc[len(data)+1]=[x, y,cuenta]

def cuenta_medio_dia(x, y, dia, hora):
    fecha = ''
    fechaInicio = ''
    fechaFin = ''
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
        
    if(hora == 'AM'):
        fechaInicio = fecha + ' 08:00:00'
        fechaFin = fecha + ' 14:00:00'
    if(hora == 'PM'):
        fechaInicio = fecha + ' 14:00:01'
        fechaFin = fecha + ' 20:00:00'
    cuenta = df['X'].loc[(df['X'] == x) & (df['Y'] == y) & (df["type"]=="check-in") & (df['time'] >= fechaInicio) & (df['time'] <= fechaFin)].count()
    data.loc[len(data)+1]=[x, y,cuenta] 

def cuenta_visitas(dia, hora, tipo, df):
    if(tipo == 'Dia'):
        cuenta_visitas_dia(dia, df)
    elif(tipo == 'Hora'):
        cuenta_visitas_hora(dia, hora, df)
    else:
        cuenta_visitas_menos6(dia, df)

def cuenta_visitas_hora(dia, hora, df):
    data = pd.DataFrame(columns=('min', 'max', 'count'))
    
    fecha = ''
    fechaInicio = ''
    fechaFin = ''
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
        
    if(hora == 'AM'):
        fechaInicio = fecha + ' 08:00:00'
        fechaFin = fecha + ' 14:00:00'
    if(hora == 'PM'):
        fechaInicio = fecha + ' 14:00:01'
        fechaFin = fecha + ' 20:00:00'
        
    df_checks_positions = df.loc[(df["type"]=="check-in") & (df['time'] >= fechaInicio) & (df['time'] <= fechaFin)]
    df_checks_positions
    
    df_us_visitas = df_checks_positions.groupby(['id']).count()

    min = 0
    max = 15
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 15
    max = 25
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 25
    max = 35
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 35
    max = 100
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
def cuenta_visitas_dia(dia, df):
    fecha = ''
    
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
        
    data = pd.DataFrame(columns=('min', 'max', 'count'))
    
    df_checks_positions = df.loc[(df["type"]=="check-in") & (df['time'] >= fecha + ' 00:00:00') & (df['time'] <= fecha + ' 23:00:00')]
    df_checks_positions
    
    df_us_visitas = df_checks_positions.groupby(['id']).count()

    min = 0
    max = 15
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 15
    max = 25
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 25
    max = 35
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 35
    max = 100
    cuenta = df_us_visitas.loc[(df_us_visitas['Timestamp'] >= min) & (df_us_visitas['Timestamp'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]

def cuenta_visitas_menos6(dia, df):
    fecha = ''
    
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
    
    df_franja = df.loc[(df['time'] >= fecha + ' 00:00:00') & (df['time'] <= fecha + ' 23:00:00')]
    grouped_times = df_franja.groupby("id")["time"]
    arrivals = grouped_times.min()
    departures = grouped_times.max()
    duration = (departures.dt.hour+departures.dt.minute/60) - (arrivals.dt.hour+arrivals.dt.minute/60)
    df_duration = pd.DataFrame(duration, columns=['duration'])
    df_index = df_duration.loc[(df_duration['duration'] >= 0) & (df_duration['duration'] < 6)]
    df_ids_under_6 = df.join(other=df_index, on='id',how='inner')
    df_checks_under_6 = df_ids_under_6.loc[df_ids_under_6['type'] == 'check-in']
    data.loc[len(data)+1]= df_checks_under_6


def promedio_visitas(df):
    df_checks_positions = df.loc[df["type"]=="check-in"]
    
    df_us_visitas = df_checks_positions.groupby(['id']).count()
    return df_us_visitas['Timestamp'].mean()
    
def cuenta_duracion_dia(dia, df):
    fecha = ''
    
    if (dia == 'Viernes'):
        fecha = '2014-06-06'
    elif(dia == 'Sabado'):
        fecha = '2014-06-07'
    else:
        fecha = '2014-06-08'
        
    data = pd.DataFrame(columns=('min', 'max', 'duration'))
    
    df_franja = df.loc[(df['time'] >= fecha + ' 00:00:00') & (df['time'] <= fecha + ' 23:00:00')]
    grouped_times = df_franja.groupby("id")["time"]
    arrivals = grouped_times.min()
    departures = grouped_times.max()
    duration = (departures.dt.hour+departures.dt.minute/60) - (arrivals.dt.hour+arrivals.dt.minute/60)
    df_duration = pd.DataFrame(duration, columns=['duration'])
    
    min = 0
    max = 10    
    cuenta = df_duration.loc[(df_duration['duration'] >= min) & (df_duration['duration'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 10
    max = 11    
    cuenta = df_duration.loc[(df_duration['duration'] >= min) & (df_duration['duration'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
    
    min = 11
    max = 12    
    cuenta = df_duration.loc[(df_duration['duration'] >= min) & (df_duration['duration'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]
 
    min = 12
    max = 100   
    cuenta = df_duration.loc[(df_duration['duration'] >= min) & (df_duration['duration'] < max)].shape[0]
    data.loc[len(data)+1]=[min, max, cuenta]

settings = {"template_path" : os.path.dirname(__file__),
            "static_path" : os.path.join(os.path.dirname(__file__),"static"),
            "debug" : True
            } 

if __name__ == "__main__":
    path = os.path.join(os.path.dirname(__file__), "../../../MC1 2015 Data/park-movement-Fri.csv")
    print('Cargando datos del Viernes...')
    dfFri = pd.read_csv(path)
    path = os.path.join(os.path.dirname(__file__), "../../../MC1 2015 Data/park-movement-Sat.csv")
    print('Cargando datos del Sabado...')
    dfSat = pd.read_csv(path)
    #path = os.path.join(os.path.dirname(__file__), "../../../MC1 2015 Data/park-movement-Sun.csv")
    #print('Cargando datos del Domingo...')
    #dfSun = pd.read_csv(path)
    print('Combinando los datos')
    df = dfFri.append([dfSat], ignore_index=True)
    print('Ajustando datos de fechas')    
    df["time"] = pd.to_datetime(df.Timestamp, format="%Y-%m-%d %H:%M:%S")

    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/conteo",ConteoHandler,{"df":df}),
        (r"/visitas",VisitasHandler,{"df":df}),
        (r"/promedio",PromedioHandler,{"df":df}),
        (r"/duracion",DuracionHandler,{"df":df}),
        (r"/data", DataHandler,{"df":df}),
        (r"/filter", DinoFilter),
        (r"/filter_data", FilterData,{"df":df}),
        (r"/static/(.*)", tornado.web.StaticFileHandler,
            {"path": settings["static_path"]})

    ], **settings)
    application.listen(8100)
    print("Listo")
    tornado.ioloop.IOLoop.current().start()

